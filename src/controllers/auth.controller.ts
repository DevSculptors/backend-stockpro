import { Request, Response } from "express";
import { GenerateToken } from "../helpers/Token";
import {
  EncryptPassword,
  ComparePassword,
  simplifyRoles,
  validateSchema,
  formatErrorMessage,
} from "../helpers/Utils";
import {
  CreateUser,
  User,
  GenerateTokenPayload,
  RolesUser,
  GenerateTokenForget,
} from "../interfaces/User";
import {
  getUserByUsername,
  createUser,
  getRoleFromUser,
  getUserByEmail,
  updateUser,
  getUserById,
} from "../services/user.services";
import { userSchema } from "../schemas/auth.schema";
import { Message } from "../helpers/Errors";

import jwt from "jsonwebtoken";
import { Resend } from "resend";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, password, isActive, email, personId } = req.body;
    const usernameFound: User = await getUserByUsername(username);
    const userEmailFound: User = await getUserByEmail(email);
    if (usernameFound || userEmailFound) {
      return res
        .status(400)
        .json({ message: "The username or email already exists" });
    }
    const passwordHash = await EncryptPassword(password);

    const newUser: CreateUser = {
      username,
      password,
      isActive,
      email,
      personId,
    };
    const validateUser = await validateSchema(userSchema, newUser);
    if ("error" in validateUser) {
      const errorMessages: Array<Message> = validateUser.error.issues;
      const messages = formatErrorMessage(errorMessages);
      return res.status(400).json(messages);
    }
    newUser.password = passwordHash;
    const userSaved: User = await createUser(newUser);
    const roles: RolesUser = await getRoleFromUser(userSaved.id);
    const listOfRoles = simplifyRoles(roles);
    const token = await GenerateToken({
      userId: userSaved.id.toString(),
      roles: listOfRoles,
    } as GenerateTokenPayload);
    res.cookie("token", token);
    return res.status(201).json(userSaved);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const userFound: User = await getUserByEmail(email);
    if (!userFound) {
      return res.status(400).json({ message: "The email does not exists" });
    }
    const isMatch: boolean = await ComparePassword(
      password,
      userFound.password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "The password is invalid" });
    }

    const roles: RolesUser = await getRoleFromUser(userFound.id);

    const listOfRoles = simplifyRoles(roles);

    const token = await GenerateToken({
      userId: userFound.id.toString(),
      roles: listOfRoles,
    } as GenerateTokenPayload);

    res.cookie("token", token);

    return res.status(200).json(userFound);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

// Organizar lo de abajo xd pero que funcione, me queme la porra haciendo esto xd

export const verifyToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Not Token ,Unauthorized" });
    }

    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);

      const { userId } = verified as GenerateTokenPayload;

      const userFind = await getUserById(userId);

      if (!userFind) {
        return res.status(400).json({ message: "The user does not exists" });
      }

      const rol: RolesUser = await getRoleFromUser(userFind.id);

      const listOfRoles = simplifyRoles(rol);

      return res
        .status(200)
        .json({ isAuthorizaded: true, user: userFind, roles: listOfRoles });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err });
  }
};

const resend = new Resend("re_K5Z93zRW_DSukEzLuVP4p2GLWGHUPUTPb");

// Si no funciona Resend para any emails, usar nodemailer
// https://medium.com/@chiragmehta900/how-to-send-mail-in-node-js-with-nodemailer-in-typescript-889cc46d1437
// https://nodemailer.com/about/

export const forgetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body: { email: string } = req.body;
    const { email } = body;

    const userFound: User = await getUserByEmail(email);
    if (!userFound) {
      return res.status(400).json({ message: "The email does not exists" });
    }
    const tokenData = {
      userId: userFound.id.toString(),
      email: userFound.email,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET as string, {
      expiresIn: 86400,
    });

    // Poner la URL del backend desplegado, en un process.env.URL_BACKEND
    const forgetUrl = `${process.env.BACKEND_URL}/change-password?token=${token}`;

    //Enviar el correo
    // @ts-ignore
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Cambio de Contraseña",
      html: `<p>Para cambiar la contraseña, por favor haga click en el siguiente enlace: <a href="${forgetUrl}">Cambiar contraseña</a></p>`,
    });

    //Quitar la URL forgetURL, solo es para pruebas
    return res
      .status(200)
      .json({ message: "Email sent", forgetUrl: forgetUrl });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

interface BodyProps {
  newPassword: string;
  confirmPassword: string;
}

export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body: BodyProps = req.body;
    const { newPassword, confirmPassword } = body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "The password is invalid" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    //Obtener el token de la URL
    const query = req.url;
    const token = query.split("=")[1];
    // console.log("Que es esto xd: ", token);
    // console.log("Que es esto xd: ", query);
    // const token = query.token as string;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const isTokenValid = jwt.verify(
        token,
        process.env.TOKEN_SECRET as string
      );

      if (!isTokenValid) {
        return res.status(401).json({ message: "Token no valido" });
      }

      const { userId, email } = isTokenValid as GenerateTokenForget;

      console.log("Que es esto xd: ", userId, email);

      const userFind = await getUserByEmail(email);

      if (!userFind) {
        return res.status(400).json({ message: "The email does not exists" });
      }

      const passwordHash = await EncryptPassword(newPassword);
      userFind.password = passwordHash;

      const update = await updateUser(userFind.id, userFind);

      //Enviar el correo
      // @ts-ignore
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Cambio de Contraseña Exitoso",
        html: `<p>Se cambio la contrasena uwu</p>`,
      });

      return res.status(200).json({ message: "Password changed" });
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

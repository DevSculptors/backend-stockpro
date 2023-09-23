import { Request, Response } from "express";
import { GenerateToken } from "../helpers/Token";
import {
  EncryptPassword,
  ComparePassword,
} from "../helpers/Utils";
import {
  CreateUser,
  User,
  GenerateTokenPayload,
  GenerateTokenForget,
} from "../interfaces/User";
import {
  getUserByUsername,
  createUser,
  getRoleFromUser,
  getUserByEmail,
  updateUser,
  getUserById,
  getRoleByName,
} from "../services/user.services";

import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { CreatePerson } from "../interfaces/Person";
import { createPerson, getPersonByDocAndPhone } from "../services/person.services";
import { IRoleName } from "../interfaces/Role";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, password, isActive, email, id_document, type_document, name, last_name, phone, roleName} = req.body;
    const usernameFound: User = await getUserByUsername(username);
    const userEmailFound: User = await getUserByEmail(email);
    const personFound = await getPersonByDocAndPhone(id_document, phone);
    const role = await getRoleByName(roleName);
    if (usernameFound || userEmailFound || personFound) {
      return res
        .status(400)
        .json({ message: "The username, email, id_document or phone already exists" });
    }
    const passwordHash = await EncryptPassword(password);
    const newPerson: CreatePerson = {
      id_document,
      type_document,
      name,
      last_name,
      phone
    }
    if(!role) return res.status(404).json({message: 'Role not found'});
    const person = await createPerson(newPerson);
    const newUser: CreateUser = {
      username,
      password,
      isActive,
      email,
      personId: person.id,
      id_role: role.id
    };
    newUser.password = passwordHash;
    const userSaved: User = await createUser(newUser);
    userSaved.roleUser = role.name;
    const roleUser: IRoleName = await getRoleFromUser(userSaved.id);
    const token = await GenerateToken({
      userId: userSaved.id.toString(),
      role: roleUser?.role.name,
    } as GenerateTokenPayload);
    res.header("Authorization", `Bearer ${token}`);
    return res.status(201).json({userSaved, token: token});
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
    const role: IRoleName = await getRoleFromUser(userFound.id);
    const userRole = role?.role.name;
    userFound.roleUser = userRole;
    const token = await GenerateToken({
      userId: userFound.id.toString(),
      role: userRole,
    } as GenerateTokenPayload);

    res.header("Authorization", `Bearer ${token}`);
    return res.status(200).json({userFound, token: token});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    delete req.headers.authorization;
    delete res.header;
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

    const token = req.headers.authorization?.split(" ")[1];
    
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
      const role = userFind.role.name;
      return res
        .status(200)
        .json({ isAuthorizaded: true, user: userFind, role: role });
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

    const forgetUrl = `${process.env.FRONTEND_URL}/login/change-password?token=${token}`;

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

    console.log("Passwords:  ", newPassword, confirmPassword);
    

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "The password is invalid" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Not Token" });
    }
    try {
      const isTokenValid = jwt.verify(
        token,
        process.env.TOKEN_SECRET as string
      );

      console.log("El token es valido: ");
      

      if (!isTokenValid) {
        return res.status(401).json({ message: "Token no valido" });
      }

      const { email } = isTokenValid as GenerateTokenForget;

      const userFind = await getUserByEmail(email);

      if (!userFind) {
        return res.status(400).json({ message: "The email does not exists" });
      }

      const passwordHash = await EncryptPassword(newPassword);
      userFind.password = passwordHash;

      await updateUser(userFind.id, userFind);
      console.log("Se cambio la contraseña en la DB");
      

      //Enviar el correo
      // @ts-ignore
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Cambio de Contraseña Exitoso",
        html: `<p>Se cambio la contrasena</p>`,
      });
      return res.status(200).json({ message: "Password changed" });
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

import { Router } from "express";

import {
  register,
  login,
  logout,
  verifyToken,
  forgetPassword,
  changePassword,
} from "../controllers/auth.controller";

export default (router: Router): void => {

  router.post("/register", register);

  router.post("/login", login);
  router.get("/logout", logout);
  router.get("/verify-token", verifyToken);
  router.post("/forget-password", forgetPassword);
  router.post("/change-password", changePassword);
};

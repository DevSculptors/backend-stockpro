import { Router } from "express";

import { register, login , logout, verifyToken} from "../controllers/auth.controller";

export default (router: Router): void => {
  router.post("/register", register);
  router.post("/login", login);
  router.get("/logout", logout);
  router.get("/verifyToken", verifyToken);
}
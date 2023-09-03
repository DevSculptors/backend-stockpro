import { getAllUsers, updateUserFields } from "../controllers/user.controller";
import { Router } from "express";

export default (router: Router): void => {
  router.get("/users", getAllUsers);
  router.put("/users", updateUserFields);
}
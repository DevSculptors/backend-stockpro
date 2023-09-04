import { assignRole, changeStateUser, createRole, getAllUsers, updateUserFields } from "../controllers/user.controller";
import { Router } from "express";

export default (router: Router): void => {
  router.get("/users", getAllUsers);
  router.put("/users", updateUserFields);
  router.put("/users/:id", changeStateUser);
  router.post("/users/role", createRole);
  router.post("/users/assignrole", assignRole);
}
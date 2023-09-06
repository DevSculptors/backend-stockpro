import { assignRole, changeStateUser, createRole, getAllUsers, updateUserFields } from "../controllers/user.controller";
import { Express } from "express";

export default (app: Express): void => {
  app.get("/api/users", getAllUsers);
  app.put("/api/users", updateUserFields);
  app.put("/api/users/:id", changeStateUser);
  app.post("/api/users/role", createRole);
  app.post("/api/users/assignrole", assignRole);
}
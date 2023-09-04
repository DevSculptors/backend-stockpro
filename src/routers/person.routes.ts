import { Router } from "express";

import {
  getPersonsController,
  createPersonController,
  updatePerson,
} from "../controllers/person.controller";
import { authRequired } from "../middlewares/ValidateToken";

export default (router: Router): void => {
  router.get("/person", authRequired, getPersonsController);
  router.post("/person", authRequired, createPersonController);
  router.put("/person", authRequired, updatePerson);
};

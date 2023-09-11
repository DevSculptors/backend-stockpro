import { createCategory, getAllCategories, getCategory } from "../controllers/categoryProduct.controller";
import { Express } from "express";


export default (app: Express): void => {
    app.get("/api/category", getAllCategories);

    app.post("/api/category", createCategory);

    app.get("/api/category/:id", getCategory);

    app.put("/api/category/:id", );
}
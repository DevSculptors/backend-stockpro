import { Request, Response } from "express";
import { changeSateCategoryById, createNewCategoryProduct, deleteCategoryById, getAllCategoryProducts, getCategoryById, getCategoryByName, updateCategoryById } from "../services/categoryProduct.services";
import { CategoryProduct, createCategoryProduct, updateCategoryProduct } from "../interfaces/CategoryProduct";
import { calculateSkip, validateUUID } from "../helpers/Utils";


export const getAllCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = Number(req.query.page) || 0;
        const limit = Number(req.query.limit) || 0;
        const categoryProducts: CategoryProduct[] = await getAllCategoryProducts(calculateSkip(page, limit), limit);
        return res.status(200).json(categoryProducts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

export const createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, description, is_active } = req.body;
        const categoryFound: CategoryProduct = await getCategoryByName(name);
        if (categoryFound) return res.status(400).json({message: "Category already exists"});
        const newCategory: createCategoryProduct = {
            name, description, is_active
        }
        const categoryCreated: CategoryProduct = await createNewCategoryProduct(newCategory);
        return res.status(200).json(categoryCreated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

export const getCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });
        const categoryFound: CategoryProduct = await getCategoryById(id);
        if (!categoryFound) return res.status(404).json({message: "Category not found"});
        return res.status(200).json(categoryFound);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message}); 
    }
}

export const updateCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });
        const categoryFound: CategoryProduct = await getCategoryById(id);
        if (!categoryFound) return res.status(404).json({message: "Category not found"});
        const { name, description, is_active } = req.body;
        const category: updateCategoryProduct = {
            name, description, is_active
        }
        const categoryUpdated: CategoryProduct = await updateCategoryById(id, category);
        return res.status(200).json(categoryUpdated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

export const changeSate = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, is_active } = req.body;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });
        const categoryFound: CategoryProduct = await getCategoryById(id);
        if (!categoryFound) return res.status(404).json({message: "Category not found"});
        const category: CategoryProduct = await changeSateCategoryById(id, is_active);
        return res.status(200).json({is_active: category.is_active});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

export const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });
        const categoryFound: CategoryProduct = await getCategoryById(id);
        if (!categoryFound) return res.status(404).json({message: "Category not found"});
        const categoryDeleted: CategoryProduct = await deleteCategoryById(id);
        return res.status(204).json(categoryDeleted);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

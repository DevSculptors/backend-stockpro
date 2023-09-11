import { Request, Response } from "express";
import { createNewCategoryProduct, getAllCategoryProducts, getCategoryById, getCategoryByName } from "../services/categoryProduct.services";
import { CategoryProduct, createCategoryProduct } from "../interfaces/CategoryProduct";


export const getAllCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
        const categoryProducts: CategoryProduct[] = await getAllCategoryProducts();
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
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

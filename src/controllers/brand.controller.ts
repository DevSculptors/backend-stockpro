import { Request, Response } from "express";
import { BrandProduct, CreateBrandProduct } from "../interfaces/BrandProduct";
import { changeStateOfBrand, createNewBrand, deleteBrand, getAllBrands, getBrandById, getBrandByName, updateBrand } from "../services/brand.services";

export const createBrand = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, is_active, description } = req.body;
        const newBrand: CreateBrandProduct = {
            name, is_active, description
        };
        const brandFound: BrandProduct = await getBrandByName(name);
        if(brandFound) return res.status(400).json({ message: "Brand already exists" });
        const brand: CreateBrandProduct = await createNewBrand(newBrand);
        return res.status(200).json(brand);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const editBrand = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { name, is_active, description } = req.body;
        const brand: BrandProduct = {
            id, name, is_active, description
        }        
        const brandFound: BrandProduct = await getBrandById(id);
        if(!brandFound) return res.status(404).json({ message: "Brand not found" }); 
        const brandEdited: BrandProduct = await updateBrand(id, brand);
        return res.status(201).json(brandEdited);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const getBrands = async (req: Request, res: Response): Promise<Response> => {
    try {
        const brands: BrandProduct[] = await getAllBrands();   
        return res.status(200).json(brands);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const getBrandInfoById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const brand: BrandProduct = await getBrandById(id);
        if(!brand) return res.status(404).json({ message: "Brand not found" });
        return res.status(200).json(brand);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const changeStateBrand = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, is_active } = req.body;
        const brandFound: BrandProduct = await getBrandById(id);
        if (!brandFound) return res.status(404).json({ message: "Brand not found" });
        const brand: BrandProduct = await changeStateOfBrand(id, is_active);
        return res.status(201).json({is_active: brand.is_active});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const deleteBrandById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const brandFound: BrandProduct = await getBrandById(id);
        if (!brandFound) return res.status(404).json({ message: "Brand not found" });
        const deletedBrand: BrandProduct = await deleteBrand(id);
        return res.status(201).json(deletedBrand);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}
import { Request, Response } from "express";
import { getProductById, getProducts } from "../services/product.services";
import { Product, ProductWithData } from "../interfaces/Product";
import { calculateSkip, castProductSalePrice, validateUUID } from "../helpers/Utils";


export const getAllProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const products: ProductWithData[] = await getProducts(calculateSkip(page, limit), limit);
        products.forEach((product: Product) => {
            castProductSalePrice(product)
        });    
        return res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const getProductInfoById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });
        const product: Product = await getProductById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        castProductSalePrice(product);
        return res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}
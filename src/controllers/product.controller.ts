import { Request, Response } from "express";
import { changeStateInProduct, createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../services/product.services";
import { Product, ProductWithData, createdProduct, updatedProduct } from "../interfaces/Product";
import { calculateSkip, castProductSalePrice, validateUUID } from "../helpers/Utils";
import { getBrandById } from "../services/brand.services";
import { getCategoryById } from "../services/categoryProduct.services";


export const getAllProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = Number(req.query.page) || 0;
        const limit = Number(req.query.limit) || 0;
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

export const createNewProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name_product, description, measure_unit, sale_price, stock, is_active, brand_id, category_id } = req.body;
        if (!validateUUID(brand_id) || !validateUUID(category_id)) return res.status(400).json({ message: "Invalid id for category or brand" });
        const brand = await getBrandById(brand_id);
        const category = await getCategoryById(category_id);
        if (!brand || !category) return res.status(404).json({ message: "Brand or category not found" });
        const newProduct: createdProduct = {
            name_product, description, measure_unit, sale_price, stock, brand_id, category_id, is_active
        }
        const product: Product = await createProduct(newProduct);
        return res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const updateOneProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const { name_product, description, measure_unit, sale_price, stock, is_active, brand_id, category_id } = req.body;
        if (!validateUUID(id) || !validateUUID(brand_id) || !validateUUID(category_id)) return res.status(400).json({ message: "Invalid id for product, category or brand" });
        const product: Product = await getProductById(id);
        const brand = await getBrandById(brand_id);
        const category = await getCategoryById(category_id);
        if (!product || !brand || !category) return res.status(404).json({ message: "Product, Brand or category not found" });
        const partialProduct: updatedProduct = {
            name_product, description, measure_unit, sale_price, stock, brand_id, category_id, is_active
        }
        const result: Product = await updateProduct(id, partialProduct);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const changeStateProduct = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { id, is_active } = req.body;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });
        const product: Product = await getProductById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        const result: Product = await changeStateInProduct(id, is_active);
        return res.status(200).json(result);
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const deleteOneProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        if (!validateUUID(id)) return res.status(400).json({ message: "Invalid id" });
        const product: Product = await getProductById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        const result: Product = await deleteProduct(id);
        return res.status(204).json(result);
    }catch (error) {
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
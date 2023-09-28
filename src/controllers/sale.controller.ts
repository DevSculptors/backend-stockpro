import { NextFunction, Request, Response } from "express";

import { createOrderSale, createSale, deleteSale, getSaleById, getSales } from "../services/sale.services";
import { CreateOrderSale, CreateSale, Sale, SaleWithPersonData } from "../interfaces/Sale";
import { validateUUID } from "../helpers/Utils";
import { getProductById, getStockPriceProduct, updateStockProduct } from "../services/product.services";

export const getAllSales = async (req: Request, res: Response): Promise<Response> => {
    try {
        const sales: SaleWithPersonData[] = await getSales();
        return res.status(200).json(sales);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

export const getInfoSaleById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        if (!validateUUID(id)) return res.status(400).json({message: "Invalid id"});
        const sale: SaleWithPersonData = await getSaleById(id);
        if (!sale) return res.status(404).json({message: "Sale not found"});
        sale.user.roleUser = sale.user.role.name;
        delete sale.user.role;
        return res.status(200).json(sale);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

export const registerSale = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { price_sale, id_client, id_user, products } = req.body;
        let isValid = await validateProducts(req);
        if (!isValid[0]) return res.status(400).json({message: isValid[1]});
        products.forEach(async (product: any) => {
            const productDetail = await getStockPriceProduct(product.id);
            await updateStockProduct(product.id, productDetail.stock-product.amount_product);
        });
        const sale: CreateSale = {
            date_sale: new Date(), price_sale, id_client, id_user, products
        }
        const newSale: SaleWithPersonData = await createSale(sale);
        newSale.user.roleUser = newSale.user.role.name;
        delete newSale.user.role;
        return res.status(201).json(newSale);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

export const validateProducts = async (req: Request): Promise<[boolean, string]> => {
    const products = req.body.products;
    let total: number = 0;
    let isValid: boolean = true;
    for (const product of products) {
        const productDetail = await getStockPriceProduct(product.id);
        const stock = productDetail?.stock;
        if (stock == undefined || stock == null) 
            return [false, "Product with id: " + product.id + " not found"];
        isValid = product.amount_product <= stock;
        if (!isValid)
            return [false, "Insufficient stock for product with id: " + product.id];
        total += productDetail.sale_price as number * product.amount_product;
        product.price = productDetail.sale_price;
    }
    console.log(total);
    if (total != req.body.price_sale) return [false, "Invalid price_sale"];
    return [true, "Success"];
}

export const deleteSaleById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        if (!validateUUID(id)) return res.status(400).json({message: "Invalid id"});
        const sale: Sale = await getSaleById(id);
        if (!sale) return res.status(404).json({message: "Sale not found"});
        const result: Sale = await deleteSale(id);
        return res.status(204).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}
import { Request, Response } from "express";
import { createInventoryPurchase, deleteInventoryPurchaseById, getInventoryPurchase, getInventoryPurchases, recordSaleInLog } from "../services/Inventory.services";
import { InventoryPurchase, InventoryPurchaseWithProductData, createdInventoryPurchase } from "../interfaces/InventoryPurchase";
import { getStockPriceProduct, modifyProduct } from "../services/product.services";

export const getAllInventoryPurchases = async (req: Request, res: Response): Promise<Response> => {
    try {
        const inventoryPurchases: InventoryPurchaseWithProductData[] = await getInventoryPurchases();
        inventoryPurchases.forEach(inventoryPurchases => {
            inventoryPurchases.user.roleUser = inventoryPurchases.user.role?.name;
            delete inventoryPurchases.user.role;
        });
        return res.status(200).json(inventoryPurchases);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const getInventoryPurchaseById = async (req: Request, res: Response):Promise<Response> => {
    try {
        const id = req.params.id;
        const inventoryPurchase: InventoryPurchaseWithProductData = await getInventoryPurchase(id);
        if (!inventoryPurchase) return res.status(404).json({ message: "Inventory purchase not found" });
        inventoryPurchase.user.roleUser = inventoryPurchase.user.role?.name;
        delete inventoryPurchase.user.role;
        return res.status(200).json(inventoryPurchase);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const deleteInventoryPurchase = async (req: Request, res: Response):Promise<Response> => {
    try {
        const id = req.params.id;
        const inventoryPFound: InventoryPurchase = await getInventoryPurchase(id);
        if (!inventoryPFound) return res.status(404).json({ message: "Inventory purchase not found" });
        const result = await deleteInventoryPurchaseById(id);
        return res.status(204).json();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const insertInventoryPurchase = async (req: Request, res: Response):Promise<Response> => {
    try {
        const { date_purchase, user_id ,person_id, purchase_detail } = req.body;
        let total_price: number = await updateInventory(purchase_detail);
        const inventoryPurchase: createdInventoryPurchase = {
            date_purchase, user_id, person_id, purchase_detail, total_price
        }
        const newInventoryPurchase: InventoryPurchaseWithProductData = await createInventoryPurchase(inventoryPurchase);
        newInventoryPurchase.user.roleUser = newInventoryPurchase.user.role?.name;
        delete newInventoryPurchase.user.role;
        const id_purchase = newInventoryPurchase.id;
        purchase_detail.forEach(async (product: any) => {
            await recordSaleInLog(product, id_purchase)
        });
        return res.status(201).json(newInventoryPurchase);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const updateInventory = async (purchase_detail: Array<any>): Promise<number> => {
    let total_price: number = 0;
    await Promise.all(
        purchase_detail.map(async (product: any) => {
        const productDetail = await getStockPriceProduct(product.product_id);
        total_price += product.quantity * product.purchase_unit_price;
        await modifyProduct(product.product_id, { sale_price: product.sale_unit_price ,stock: productDetail.stock+product.quantity});
    }));
    return total_price;
}
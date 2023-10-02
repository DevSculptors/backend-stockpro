import { InventoryPurchase, InventoryPurchaseWithProductData, createdInventoryPurchase } from "../interfaces/InventoryPurchase";
import {prisma } from "../helpers/Prisma";

const QUERY_FOR_ALL_FIELDS = {
    id: true,
    date_purchase: true,
    user: {
        select: {
            id: true,
            username: true,
            email: true,
            isActive: true,
            role: true,
            person: true
        }
    },
    person: true,
    purchase_detail: {
        select: {
            quantity: true,
            due_date: true,
            purchase_unit_price: true,
            product: {
                select: {
                    id: true,
                    name_product: true,
                    description: true,
                    measure_unit: true,
                    sale_price: true,
                    stock: true,
                    is_active: true,
                    brand: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    }
};

export const getInventoryPurchases = async (): Promise<InventoryPurchaseWithProductData[]> => {
    const inventoryPurchases: InventoryPurchaseWithProductData[] = await prisma.inventory_Purchase.findMany({
        select: QUERY_FOR_ALL_FIELDS
    });
    return inventoryPurchases;    
}

export const getInventoryPurchase = async (id: string): Promise<InventoryPurchaseWithProductData> => {
    const inventoryPurchase: InventoryPurchaseWithProductData = await prisma.inventory_Purchase.findUnique({
        where: {
            id: id
        },
        select: QUERY_FOR_ALL_FIELDS
    });
    return inventoryPurchase;    
}

export const deleteInventoryPurchaseById = async (id: string): Promise<InventoryPurchase> => {
    await deletePurchaseDetail(id);
    const inventoryPurchase: any = await prisma.inventory_Purchase.delete({
        where: {
            id: id
        }
    });
    return inventoryPurchase;    
}

export const deletePurchaseDetail = async (id_purchase: string): Promise<any> => {
    const result: any = await prisma.purchase_Detail.deleteMany({
        where: {
            id_purchase: id_purchase
        }
    });
    return result;    
}

export const createInventoryPurchase = async (inventoryPurchase: createdInventoryPurchase): Promise<InventoryPurchaseWithProductData> => {
    const newInventoryPurchase: InventoryPurchaseWithProductData = await prisma.inventory_Purchase.create({
        data: {
            date_purchase: inventoryPurchase.date_purchase,
            person: {
                connect: {
                    id: inventoryPurchase.person_id
                }
            },
            user: {
                connect: {
                    id: inventoryPurchase.user_id
                }
            },
            purchase_detail: {
                create: inventoryPurchase.purchase_detail.map((product: any) => {
                    return {
                        quantity: product.quantity,
                        due_date: product.due_date,
                        purchase_unit_price: product.purchase_unit_price,
                        product: {
                            connect: {
                                id: product.product_id
                            }
                        }
                    }
                })
            }
        },
        select: QUERY_FOR_ALL_FIELDS
    });
    return newInventoryPurchase;    
}

export const recordSaleInLog = async (product: any, id: string): Promise<any> => {
    const saleLog: any = await prisma.sale_Record.createMany({
        data: {
            sale_price: product.purchase_unit_price,
            update_date: new Date(),
            id_product: product.product_id,
            id_purchase: id
        }
    });
    return saleLog;
}
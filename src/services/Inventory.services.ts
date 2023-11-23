import { InventoryPurchase, InventoryPurchaseWithProductData, createdInventoryPurchase } from "../interfaces/InventoryPurchase";
import {prisma } from "../helpers/Prisma";

const QUERY_FOR_ALL_FIELDS = {
    id: true,
    date_purchase: true,
    total_price: true,
    user: {
        select: {
            id: true,
            username: true,
            email: true,
        }
    },
    person: {
        select: {
            id: true,
            name: true,
            last_name: true,
        }
    },
    purchase_detail: {
        select: {
            quantity: true,
            due_date: true,
            purchase_unit_price: true,
            sale_unit_price: true,
            product: {
                select: {
                    id: true,
                    name_product: true,
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
    await deleteSaleLog(id);
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

export const deleteSaleLog = async (id_purchase: string): Promise<any> => {
    const result: any = await prisma.sale_Record.deleteMany({
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
            total_price: inventoryPurchase.total_price as number,
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
                        sale_unit_price: product.sale_unit_price,
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
            sale_price: product.sale_unit_price,
            update_date: new Date(),
            id_product: product.product_id,
            id_purchase: id
        }
    });
    return saleLog;
}
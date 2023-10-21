import {prisma } from "../helpers/Prisma";

import { CreateSale, Sale, SaleWithPersonData } from "../interfaces/Sale";

const QUERY_FOR_ALL_FIELDS = {
    id: true,
    date_sale: true,
    price_sale: true,
    person: true,
    oders: {
        select:{
            id: true,
            price: true,
            amount_product: true,
            product: {
                select: {
                    id: true,
                    name_product: true,
                    description: true,
                    measure_unit: true,
                    sale_price: true,
                    stock: true,
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
    },
    turn: {
        select: {
            id: true,
            date_time_start: true,
            base_cash: true,
            date_time_end: true,
            final_cash: true,
            is_active: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                }
            },
        }
    }
}

export const getSales = async (): Promise<SaleWithPersonData[]> => {
    const sales: SaleWithPersonData[] = await prisma.sale.findMany({
        select: QUERY_FOR_ALL_FIELDS
    });
    return sales;    
}

export const getSaleById = async (id: string): Promise<SaleWithPersonData> => {
    const sale: SaleWithPersonData = await prisma.sale.findUnique({
        where: {
            id: id
        },
        select: QUERY_FOR_ALL_FIELDS
    });
    return sale;
}

export const createSale = async (data: CreateSale): Promise<SaleWithPersonData> => {
    const sale: SaleWithPersonData = await prisma.sale.create({
        data: {
            date_sale : data.date_sale,
            price_sale: data.price_sale,
            person: {
                connect: {
                    id: data.id_client
                }
            },
            turn: {
                connect: {
                    id: data.id_turn
                },
            },
            oders: {
                create: data.products.map((product: any) => {
                    return {
                        price: product.price*product.amount_product,
                        amount_product: product.amount_product,
                        product: {
                            connect: {
                                id: product.id
                            }
                        }
                    }
                })
            }
        },
        select: QUERY_FOR_ALL_FIELDS
    });
    return sale;
}

export const deleteSale = async (id: string): Promise<Sale> => {
    await deleteOderSales(id);
    const sale: Sale = await prisma.sale.delete({
        where: {
            id: id
        }
    });
    return sale;
}

export const deleteOderSales = async (id: string): Promise<any> => {
    const orders = await prisma.order_Sale.deleteMany({
        where: {
            id_sale: id
        }
    });
    return orders.count;
}

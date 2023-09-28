import {prisma } from "../helpers/Prisma";

import { CreateOrderSale, CreateSale, OrderSale, Sale, SaleWithPersonData } from "../interfaces/Sale";

export const getSales = async (): Promise<SaleWithPersonData[]> => {
    const sales: SaleWithPersonData[] = await prisma.sale.findMany({
        select: {
            id: true,
            date_sale: true,
            price_sale: true,
            person: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    isActive: true,
                    person: true
                }
            },
            oders: {
                select: {
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
            }
        }
    });
    return sales;    
}

export const getSaleById = async (id: string): Promise<SaleWithPersonData> => {
    const sale: SaleWithPersonData = await prisma.sale.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            date_sale: true,
            price_sale: true,
            person: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    isActive: true,
                    person: true,
                    role: true
                }
            },
            oders: {
                select: {
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
            }
        }
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
            user: {
                connect: {
                    id: data.id_user
                }
            },
            oders: {
                create: data.products.map((product: any) => {
                    return {
                        price: product.price,
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
        select: {
            id: true,
            date_sale: true,
            price_sale: true,
            person: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    isActive: true,
                    person: true,
                    role: true
                }
            },
            oders: {
                select: {
                    id: true,
                    price: false,
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
            }
        }
    });
    return sale;
}

export const createOrderSale = async (data: CreateOrderSale): Promise<OrderSale> => {
    const orderSale: OrderSale = await prisma.order_Sale.create({
        data: {
            amount_product: data.amount_product,
            price: data.price,
            product: {
                connect: {
                    id: data.id_product
                }
            },
            sale: {
                connect: {
                    id: data.id_sale
                }
            }
        }
    });
    return orderSale;
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

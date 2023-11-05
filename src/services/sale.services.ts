import { chartData } from "../helpers/Utils";
import {prisma } from "../helpers/Prisma";

import { CreateSale, ValueOfDay, ReportByMonth, Sale, SaleWithPersonData, SaleWithPersonDataOptional } from "../interfaces/Sale";
import { Person, UpdatePerson } from "../interfaces/Person";

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

export const getSalesBetween = async (sundayDate: Date, saturdayDate: Date): Promise<any> => {
    const sales = await prisma.sale.findMany({
        where: {
            date_sale: {
                gte: sundayDate,
                lte: saturdayDate
            }
        },
        select: {
            date_sale: true,
            price_sale: true,
            id_client: true,
            oders: {
                select: {
                    amount_product: true,
                }
            },
        },
    });
    return sales;
}

export const getTopClientSale = async (topNumber: number): Promise<SaleWithPersonDataOptional[]> => {
    const topSales:SaleWithPersonDataOptional[] = await prisma.sale.findMany({
        skip: 0,
        take: topNumber,
        select: {
            person: {
                select: {
                    name: true,
                    last_name: true,
                    phone: true,
                }
            },
            price_sale: true,
        },
        orderBy: {
            price_sale: 'desc'
        },
    });
    return topSales;
}
// to do
export const getTopProducts = async (topNumber: number): Promise<any> => {
    const topProducts:any[] = await prisma.order_Sale.findMany({
        // skip: 0,
        // take: topNumber,
        include: {
            product: {
                include:{
                    category: true
                }
            }
        }
    });
    /**
     * achiras:83, Bimbojaldres Croissandwich: 3, ponque: 1
     * agua: 2 
     * avena original: 1, alpin: 1, avena canela: 10
     * acondicionador liso: 13, acondicionador risos: 1
     * 
     * 
     */
    type CategoryCount = Record<any, number>;
    let arrCategoryCount:CategoryCount[] = [];
    topProducts.forEach((value: any) => {
        let categoryCount:CategoryCount = {
            id: value.product.category.id,
            name: value.product.category.name,
            count: 0
        }
        let index = arrCategoryCount.findIndex((item: CategoryCount) => item.id === categoryCount.id);
        if (index > -1) {
            arrCategoryCount[index].count += value.amount_product;
        }else{
            arrCategoryCount.push(categoryCount);
        }
    });
    // console.log(arrCategoryCount);
    return arrCategoryCount;
}

export const getTotalSalesByMonth = async (): Promise<ReportByMonth> => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const totalSales: number = await prisma.sale.count({
        where: {
            date_sale: {
                gte: firstDayOfMonth,
                lt: currentDate,
            }
        }
    });
    const sales: Sale[] = await getSalesBetween(firstDayOfMonth, currentDate);
    chartData.forEach((item: ValueOfDay) => {
        item.value = 0;
    });
    console.log(sales);
    sales.forEach((sale: any) => {
        const date:Date = new Date(sale.date_sale);
        const dayNumber:number = date.getUTCDay();
        let incomeOfDay:ValueOfDay = chartData[dayNumber];
        incomeOfDay.value = Number(incomeOfDay.value) + 1;
        chartData[dayNumber] = incomeOfDay;
    });
    const reportByMonth: ReportByMonth = { total: totalSales, chartData};
    return reportByMonth;
}

export const getTotalRevenueByMonth = async (): Promise<ReportByMonth> => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const totalRevenue: any = await prisma.sale.aggregate({
        where: {
            date_sale: {
                gte: firstDayOfMonth,
                lt: currentDate,
            }
        },
        _sum: {
            price_sale: true
        }
    });
    const sales: Sale[] = await getSalesBetween(firstDayOfMonth, currentDate);
    chartData.forEach((item: ValueOfDay) => {
        item.value = 0;
    });
    sales.forEach((sale: Sale) => {
        const date:Date = new Date(sale.date_sale);
        const dayNumber:number = date.getUTCDay();
        let incomeOfDay:ValueOfDay = chartData[dayNumber];
        incomeOfDay.value = Number(incomeOfDay.value) + Number(sale.price_sale)
        chartData[dayNumber] = incomeOfDay;
    });
    const reportByMonth: ReportByMonth = { total: totalRevenue._sum.price_sale, chartData};
    return reportByMonth;
}

export const getTotalProductsByMonth = async (): Promise<ReportByMonth> => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const sales: Sale[] = await getSalesBetween(firstDayOfMonth, currentDate);
    chartData.forEach((item: ValueOfDay) => {
        item.value = 0;
    });
    let totalProducts:number = 0;
    sales.forEach((sale: any) => {
        const date:Date = new Date(sale.date_sale);
        const dayNumber:number = date.getUTCDay();
        let incomeOfDay:ValueOfDay = chartData[dayNumber];
        incomeOfDay.value = Number(incomeOfDay.value) + Number(sale.oders.length)
        chartData[dayNumber] = incomeOfDay;
        totalProducts += sale.oders.length;
    });
    const reportByMonth: ReportByMonth = { total: totalProducts, chartData};
    return reportByMonth;
}

export const getBestClientOfTheMonth = async (): Promise<any> => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const sales: Sale[] = await getSalesBetween(firstDayOfMonth, currentDate);
    type ClientVisits = {id:string, count:number};
    let clientsVisits:ClientVisits[] = []
    sales.forEach((sale: any) => {
        const found = clientsVisits.find((client: ClientVisits) => client.id === sale.id_client);
        if(found){
            found.count += 1; 
        }else{
            clientsVisits.push({id: sale.id_client, count: 1});
        }
    });
    return clientsVisits.reduce((bestClient: ClientVisits, client: ClientVisits) => {
        return client.count > bestClient.count ? client: bestClient;
    }, {id: "", count: 0});
}
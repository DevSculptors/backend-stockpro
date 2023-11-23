import { ValuesOfDay, CategoriesPerDay, chartData, getLastSundaySaturdayDates, weekday, CategoryAmount, fillCategoriesPerDay } from "../helpers/Utils";
import {prisma } from "../helpers/Prisma";

import { CreateSale, ValueOfDay, ReportByMonth, Sale, SaleWithPersonData, SaleWithPersonDataOptional } from "../interfaces/Sale";

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

export const getSalesBetween = async (sundayDateString: string, saturdayDateString: string): Promise<any> => {
    let sundayDate:Date, saturdayDate:Date;
    if(!sundayDateString || !saturdayDateString){
        let dates = getLastSundaySaturdayDates();
        sundayDate = dates.sundayDate;
        saturdayDate = dates.saturdayDate;
    }else{
        sundayDate = new Date(sundayDateString);
        saturdayDate = new Date(saturdayDateString);
    }
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
    let topSales:SaleWithPersonDataOptional[] = await prisma.sale.findMany({
        // skip: 0,
        // take: topNumber,
        select: {
            person: {
                select: {
                    id: true,
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
    topSales = topSales.reduce((acc: SaleWithPersonData[], sale: SaleWithPersonData) => {
        const found = acc.find((item: SaleWithPersonData) => item.person.id === sale.person.id);
        if(found){
            found.price_sale = Number(found.price_sale) + Number(sale.price_sale);
        }else{
            sale.price_sale = Number(sale.price_sale);
            acc.push(sale);
        }
        return acc;
    }, []);
    topSales.sort((a: SaleWithPersonData, b: SaleWithPersonData) => Number(b.price_sale) - Number(a.price_sale));
    topSales = topSales.slice(0,topNumber);
    return topSales;
}

export const getTopNCategories = async (topNumber: number): Promise<any> => {
    let topProducts:any[] = await prisma.order_Sale.findMany({
        select: {
            product: {
                select: {
                    name_product: true,
                    category: { 
                        select: {
                            name: true
                        }
                    }
                }
            },
            amount_product: true,
        },
    });
    topProducts = topProducts.reduce((acc: any, product: any) => {
        const found = acc.find((item: any) => item.category === product.product.category.name);
        if(found){
            found.amount += product.amount_product;
        }else{
            let newProduct = {
                category: product.product.category.name,
                amount: product.amount_product,
            }
            acc.push(newProduct);
        }
        return acc;
    }, []);
    topProducts.sort((a: any, b: any) => b.amount - a.amount);
    return topProducts.slice(0,topNumber);
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
    const sales: Sale[] = await getSalesBetween(firstDayOfMonth.toISOString(), currentDate.toISOString());
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
    const sales: Sale[] = await getSalesBetween(firstDayOfMonth.toISOString(), currentDate.toISOString());
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
    const reportByMonth: ReportByMonth = { total: totalRevenue?._sum?.price_sale || 0, chartData};
    return reportByMonth;
}

export const getTopCategoriesByWeekService = async (topNumber: number): Promise<any> => {
    const { sundayDate, saturdayDate } = getLastSundaySaturdayDates();
    let topProducts:any[] = await prisma.order_Sale.findMany({
        select: {
            product: {
                select: {
                    category: { 
                        select: {
                            name: true
                        }
                    },
                }
            },
            sale: {
                select: {
                    date_sale: true,
                }
            },
            amount_product: true,
        },
        where: {    
            sale: {
                date_sale: {
                    gte: sundayDate,
                    lte: saturdayDate,
                }
            }
        }
    });
    topProducts = topProducts.reduce((acc: any, product: any) => {
        const found = acc.find((item: any) => item.category === product.product.category.name);
        if(found){
            found.amount += product.amount_product;
        }else{
            let newItem = {
                category: product.product.category.name,
                amount: product.amount_product,
                date: product.sale.date_sale,
            }
            acc.push(newItem);
        }
        return acc;
    }, []);
    topProducts.sort((a: any, b: any) => b.amount - a.amount);
    topProducts = topProducts.slice(0,topNumber);
    const categories:Set<string> = new Set();
    const categoriesPerDay: CategoriesPerDay = fillCategoriesPerDay(); 
    topProducts.forEach((product: any) => {
        const date:Date = new Date(product.date);
        const dayNumber:number = date.getUTCDay();
        let valuesOfDay:ValuesOfDay = categoriesPerDay[dayNumber];
        const categoryAmount:CategoryAmount = {
            category: product.category,
            amount: product.amount,
        }
        valuesOfDay.values.push(categoryAmount);
        categoriesPerDay[dayNumber] = valuesOfDay;
        categories.add(product.category);
    });
    categories.forEach((category: string) => {
        categoriesPerDay.forEach((item: ValuesOfDay) => {
            const found = item.values.find((value: CategoryAmount) => value.category === category);
            if(!found){
                const CategoryAmount:CategoryAmount = {
                    category: category,
                    amount: 0,
                }
                item.values.push(CategoryAmount);
            }
        });
    });
    return categoriesPerDay;
}

export const getTotalProductsByMonth = async (): Promise<ReportByMonth> => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const sales: Sale[] = await getSalesBetween(firstDayOfMonth.toISOString(), currentDate.toISOString());
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
    const sales: Sale[] = await getSalesBetween(firstDayOfMonth.toISOString(), currentDate.toISOString());
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
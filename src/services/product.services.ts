import { Product, ProductWithData } from "../interfaces/Product";
import { prisma } from "../helpers/Prisma";

export const getProducts = async (skip: number, limit: number): Promise<ProductWithData[]> => {
    const products: ProductWithData[] = await prisma.product.findMany({
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
                    is_active: true,
                    description: true
                }
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    is_active: true,
                    description: true
                }
            }
        },
        skip: skip,
        take: limit,
        orderBy: {
            name_product: "asc"
        }
    });
    return products;
}

export const getProductById = async (id: string): Promise<Product> => {
    const product: any = await prisma.product.findUnique({
        where: {
            id: id
        },
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
                    is_active: true,
                    description: true
                }
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    is_active: true,
                    description: true
                }
            }
        }
    });
    return product;
}


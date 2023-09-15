import { Product } from "../interfaces/Product";
import { prisma } from "../helpers/Prisma";

export const getProducts = async (): Promise<Product[]> => {
    const products: any[] = await prisma.product.findMany();
    return products;
}

export const getProductById = async (id: string): Promise<Product> => {
    const product: any = await prisma.product.findUnique({
        where: {
            id: id
        }
    });
    return product;
}


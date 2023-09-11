import { CategoryProduct, createCategoryProduct } from "../interfaces/CategoryProduct";
import {prisma } from "../helpers/Prisma";

export const getAllCategoryProducts = async (): Promise<CategoryProduct[]> => {
    const categoryProducts: CategoryProduct[] = await prisma.category_Product.findMany({});
    return categoryProducts;
}

export const createNewCategoryProduct = async (newCategoryProduct: createCategoryProduct): Promise<CategoryProduct> => {
    const categoryProduct: CategoryProduct = await prisma.category_Product.create({
        data: newCategoryProduct
    });
    return categoryProduct;
}

export const getCategoryByName = async (name: string): Promise<CategoryProduct> => {
    const categoryProduct: CategoryProduct = await prisma.category_Product.findFirst({
        where: {
            name: name
        }
    });
    return categoryProduct;
}

export const getCategoryById = async (id: string): Promise<CategoryProduct> => {
    const categoryProduct: CategoryProduct = await prisma.category_Product.findUnique({
        where: {
            id: id
        }
    });
    return categoryProduct;
}
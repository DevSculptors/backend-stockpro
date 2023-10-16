import { CategoryProduct, createCategoryProduct, updateCategoryProduct } from "../interfaces/CategoryProduct";
import {prisma } from "../helpers/Prisma";

export const getAllCategoryProducts = async (skip: number, limit: number): Promise<CategoryProduct[]> => {
    const categoryProducts: CategoryProduct[] = await prisma.category_Product.findMany({
        skip: skip,
        // take: limit,
        orderBy: {
            name: "asc"
        }
    });
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
    console.error(id);
    const categoryProduct: CategoryProduct = await prisma.category_Product.findUnique({
        where: {
            id: id
        }
    });
    return categoryProduct;
}

export const updateCategoryById = async (id: string, data: updateCategoryProduct): Promise<CategoryProduct> => {
    const categoryProductEdited: CategoryProduct = await prisma.category_Product.update({
        where: {
            id: id
        },
        data: data
    });
    return categoryProductEdited;
}

export const deleteCategoryById = async (id: string): Promise<CategoryProduct> => {
    const categoryProduct: CategoryProduct = await prisma.category_Product.delete({
        where: {
            id: id
        }
    });
    return categoryProduct;
}

export const changeSateCategoryById = async (id: string, state: boolean): Promise<CategoryProduct> => {
    const categoryProduct: CategoryProduct = await prisma.category_Product.update({
        where: {
            id: id
        },
        data: {
            is_active: state
        }
    });
    return categoryProduct;
}
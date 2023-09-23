import { Product, ProductWithData, createdProduct, updatedProduct } from "../interfaces/Product";
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
            is_active: true,
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

export const createProduct = async (product: createdProduct): Promise<Product> => {
    const newProduct: Product = await prisma.product.create({
        data: {
            name_product: product.name_product,
            description: product.description,
            measure_unit: product.measure_unit,
            sale_price: product.sale_price,
            stock: product.stock,
            is_active: product.is_active,
            brand: {
                connect: {
                    id: product.brand_id
                }
            },
            category: {
                connect: {
                    id: product.category_id
                }
            }
        }
    });
    return newProduct;
}

export const updateProduct = async (id: string, product: updatedProduct): Promise<Product> => {
    const updatedProduct: Product = await prisma.product.update({
        where: {
            id: id
        },
        data: {
            name_product: product.name_product,
            description: product.description,
            measure_unit: product.measure_unit,
            sale_price: product.sale_price,
            stock: product.stock,
            is_active: product.is_active,
            brand: {
                connect: {
                    id: product.brand_id
                }
            },
            category: {
                connect: {
                    id: product.category_id
                }
            }
        }
    });
    return updatedProduct;
}

export const changeStateInProduct = async (id: string, state: boolean): Promise<Product> => {
    const updatedProduct: Product = await prisma.product.update({
        where: {
            id: id
        },
        data: {
            is_active: state
        }
    });
    return updatedProduct;
}

export const deleteProduct = async (id: string): Promise<Product> => {
    const deletedProduct: Product = await prisma.product.delete({
        where: {
            id: id
        }
    });
    return deletedProduct;
}


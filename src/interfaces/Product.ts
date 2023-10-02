import { BrandProduct } from "./BrandProduct";
import { CategoryProduct } from "./CategoryProduct";

export interface Product{
  id: string;
  name_product: string;
  description: string;
  measure_unit: any;
  sale_price: any;
  stock: number;
  is_active: boolean;
}

export type createdProduct = Omit<Product, "id"> &{
  brand_id: string;
  category_id: string;
};

export type updatedProduct = Partial<Product> &{
  brand_id?: string;
  category_id?: string;
};

export interface ProductWithData extends Product {
  brand: {
    id: string;
    name: string;
    is_active?: boolean;
    description?: string;
  };
  category: {
    id: string;
    name: string;
    is_active?: boolean;
    description?: string;
  };
}
import { BrandProduct } from "./BrandProduct";
import { CategoryProduct } from "./CategoryProduct";

export interface Product{
  id: string;
  name_product: string;
  description: string;
  measure_unit: any;
  sale_price: any;
  stock: number;
}

export interface ProductWithData extends Product {
  brand: {
    id: string;
    name: string;
    is_active: boolean;
    description: string;
  };
  category: {
    id: string;
    name: string;
    is_active: boolean;
    description: string;
  };
}
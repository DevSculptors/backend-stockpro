import { Measure } from "@prisma/client";

export interface Product{
  id: string;
  name_product: string;
  description: string;
  measure_unit: Measure;
  sale_price: number;
  stock: number;
}
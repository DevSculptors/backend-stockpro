export interface Product{
  id: string;
  name_product: string;
  description: string;
  measure_unit: any;
  sale_price: number;
  stock: number;
  sale_price_cast?: number;
}
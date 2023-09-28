import { Person } from "./Person";
import { Product } from "./Product";
import { UserWithPersonData } from "./User";

export interface Sale {
    id: string;
    date_sale: Date;
    price_sale: unknown;
}

export type CreateSale = Omit<Sale, "id" | "price_sale"> &{
    price_sale: number;
    id_client: string;
    id_user: string;
    products: Partial<Product>[];
};

export interface OrderSale {
    id: string;
    price: unknown;
    amount_product: number;
    id_product: string;
    id_sale: string;
}

export type CreateOrderSale = Omit<OrderSale, "id" | "price"> & {
    price: number;
}

export interface SaleWithPersonData extends Sale {
    person: Person;
    user: UserWithPersonData;
}
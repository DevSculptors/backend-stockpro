import { Person } from "./Person";
import { ProductWithData } from "./Product";
import { UserWithPersonData } from "./User";

export interface InventoryPurchase {
    id: string;
    date_purchase: Date;
    user: UserWithPersonData;
    person: Partial<Person>;
}

export type createdInventoryPurchase = Omit<InventoryPurchase, "id" | "user" | "person"> & {
    person_id: string;
    user_id: string;
    purchase_detail: {
        quantity: number;
        due_date: Date;
        purchase_unit_price: unknown;
        id_product: string;
    }[];
}

export type InventoryPurchaseWithProductData = InventoryPurchase & {
    purchase_detail: {
        quantity: number;
        due_date: Date;
        purchase_unit_price: unknown;
        product: Partial<ProductWithData>;
        product_id?: string;
    }[];
}


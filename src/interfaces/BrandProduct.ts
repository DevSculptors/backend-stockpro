export interface BrandProduct {
    id: string;
    name: string;
    is_active: boolean;
    description: string;
}

export type CreateBrandProduct = Omit<BrandProduct, "id">;

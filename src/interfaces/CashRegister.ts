import { type } from "os";
import { User } from "./User";

export interface CashRegister {
    id: string;
    name: string;
    location: string;
}

export type CreateCashRegister = Omit<CashRegister, 'id'>;
export type UpdateCashRegister = Partial<CashRegister>;
export type Turn = {
    id: string;
    date_time_start: Date;
    base_cash: unknown | number;
    date_time_end?: Date;
    final_cash?: unknown | number;
    is_active: boolean;
    user?: Partial<User>;
}

export type CreateTurn = Omit<Turn, 'id' | 'is_active'>;
export type UpdateTurn = Partial<Turn>;

export type CashRegisterTurn = Partial<CashRegister> & {
    turns: Turn[];
}
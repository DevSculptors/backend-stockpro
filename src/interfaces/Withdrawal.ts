export interface Withdrawal {
    id: string;
    withdrawal_date: Date;
    value: unknown;
}

export type CreateWithdrawal = Omit<Withdrawal, 'id'>;
export type UpdateWithdrawal = Partial<Withdrawal>;

export interface ImbalanceLog{
    id: string;
    value: number | unknown;
    description: string;
}

export type CreateImbalanceLog = Omit<ImbalanceLog, 'id'>;
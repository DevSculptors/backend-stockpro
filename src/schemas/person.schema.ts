import { z } from 'zod';

export const personSchema = z.object({
    id_document: z.string().min(8),
    name: z.string(),
    last_name: z.string(),
    phone: z.string().min(10),
    type_document: z.enum(['CC', 'CE', 'TI', 'NIT', 'PP'])
});
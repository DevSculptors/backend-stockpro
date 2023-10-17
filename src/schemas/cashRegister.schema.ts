import { number, z } from "zod";

import { object, string, array } from "zod";

const regexDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/;

export const createCashRegisterSchema = object({
    body: object({
        name: string().min(3, {
            message: "El nombre debe tener mínimo 3 caracteres"
        }).max(50, {
            message: "El nombre debe tener máximo 50 caracteres"
        }),
        location: string().min(3, {
            message: "La ubicación debe tener mínimo 3 caracteres"
        }).max(50, {
            message: "La ubicación debe tener máximo 50 caracteres"
        })
    })
});

export const updateCashRegisterSchema = object({
    body: object({
        id: string().min(36, {
            message: "El id es inválido"
        }).max(36, {
            message: "El id es inválido"
        }),
        name: string().min(3, {
            message: "El nombre debe tener mínimo 3 caracteres"
        }).max(50, {
            message: "El nombre debe tener máximo 50 caracteres"
        }),
        location: string().min(3, {
            message: "La ubicación debe tener mínimo 3 caracteres"
        }).max(50, {
            message: "La ubicación debe tener máximo 50 caracteres"
        })
    })
});

export const createTurnSchema = object({
    body: object({
        date_time_start: string().regex(regexDate, {
            message: "Fecha no válida"
        }),
        base_cash: number().min(100, {
            message: "El valor no es válido"
        }),
        id_user: string().min(36, {
            message: "El id es inválido"
        }).max(36, {
            message: "El id es inválido"
        })
    })
});

export const closeTurnSchema = object({
    body: object({
        id_turn: string().min(36, {
            message: "El id es inválido"
        }).max(36, {
            message: "El id es inválido"
        }),
        date_time_end: string().regex(regexDate, {
            message: "Fecha no válida"
        }),
        final_cash: number().min(100, {
            message: "El valor no es válido"
        })
    })
});

export const createWithdrawalSchema = object({
    body: object({
        withdrawal_date: string().regex(regexDate, {
            message: "Fecha no válida"
        }),
        value: number().min(100, {
            message: "El valor no es válido"
        })
    })
});
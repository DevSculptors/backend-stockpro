import { CashRegister, CashRegisterTurn, CreateCashRegister, CreateTurn, Turn, UpdateCashRegister, UpdateTurn } from "../interfaces/CashRegister";
import {prisma } from "../helpers/Prisma";
import { CreateWithdrawal, Withdrawal } from "../interfaces/Withdrawal";

const QUERY_FOR_CASH_REGISTER_WITH_TURNS = {
    id: true,
    name: true,
    location: true,
    turns: {
        select: {
            id: true,
            date_time_start: true,
            base_cash: true,
            date_time_end: true,
            final_cash: true,
            is_active: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                }
            },
            withdrawals: {
                select: {
                    id: true,
                    withdrawal_date: true,
                    value: true
                }
            }
        }
    },
}

export const getAllCashRegisters = async (): Promise<CashRegisterTurn[]> => {
    const cashRegisters: CashRegisterTurn[] = await prisma.cash_Register.findMany({
        orderBy: {
            name: "asc"
        },
        select: QUERY_FOR_CASH_REGISTER_WITH_TURNS
    });
    return cashRegisters;
}

export const getCashRegisterById = async (id: string): Promise<CashRegisterTurn> => {
    const cashRegister: CashRegisterTurn = await prisma.cash_Register.findUnique({
        where: {
            id: id
        },
        select: QUERY_FOR_CASH_REGISTER_WITH_TURNS
    });
    return cashRegister;
}

export const createNewCashRegister = async (newCashRegister: CreateCashRegister): Promise<CashRegister> => {
    const cashRegister: CashRegister = await prisma.cash_Register.create({
        data: newCashRegister
    });
    return cashRegister;
}

export const updateCashRegister = async (updateCashRegister: UpdateCashRegister): Promise<CashRegister> => {
    const cashRegister: CashRegister = await prisma.cash_Register.update({
        where: {
            id: updateCashRegister.id
        },
        data: updateCashRegister
    });
    return cashRegister;
}

export const createTurn = async (cashRegisterId: string, userId: string, turnData: CreateTurn): Promise<CashRegisterTurn> => {
    const cashRegister: CashRegisterTurn = await prisma.cash_Register.update({
        where: {
            id: cashRegisterId
        },
        data: {
            turns: {
                create: {
                    date_time_start: turnData.date_time_start,
                    base_cash: turnData.base_cash as number,
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            }
        },
        select: QUERY_FOR_CASH_REGISTER_WITH_TURNS
    });
    return cashRegister;
}

export const closeTurn = async (cashRegisterId: string, turn: UpdateTurn): Promise<CashRegisterTurn> => {
    const cashRegister: CashRegisterTurn = await prisma.cash_Register.update({
        where: {
            id: cashRegisterId
        },
        data: {
            turns: {
                update: {
                    where: {
                        id: turn.id
                    },
                    data: {
                        date_time_end: turn.date_time_end,
                        final_cash: turn.final_cash as number,
                        is_active: false
                    }
                }
            }
        },
        select: QUERY_FOR_CASH_REGISTER_WITH_TURNS
    });
    return cashRegister;
}

export const createWithdrawal = async (turnId: string, withdrawal: CreateWithdrawal): Promise<Withdrawal> => {
    const withdrawalSaved: Withdrawal = await prisma.withdrawal.create({
        data: {
            withdrawal_date: withdrawal.withdrawal_date,
            value: withdrawal.value as number,
            turn: {
                connect: {
                    id: turnId
                }
            }
        }
    });
    return withdrawalSaved;
}

export const getTurnById = async (id: string): Promise<Turn> => {
    const turn: Turn = await prisma.turn.findUnique({
        where: {
            id: id
        }
    });
    return turn;
}

export const deleteOneCashRegister = async (id: string, turns: Turn[]): Promise<void> => {
    turns.forEach(async (turn) => {
        await deleteWithdrawal(turn.id);
    });
    await deleteTurn(id);
    await prisma.cash_Register.delete({
        where: {
            id: id
        },
    });
}

export const deleteTurn = async (id: string): Promise<void> => {
    await prisma.turn.deleteMany({
        where: {
            id_cash_register: id
        },
    });
}

export const deleteWithdrawal = async (id: string): Promise<void> => {
    await prisma.withdrawal.deleteMany({
        where: {
            id_turn: id
        }
    });
}
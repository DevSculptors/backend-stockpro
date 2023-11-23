import { CashRegister, CashRegisterTurn, CashRegisterTurns, CreateCashRegister, CreateTurn, Turn, UpdateCashRegister, UpdateTurn } from "../interfaces/CashRegister";
import {prisma } from "../helpers/Prisma";
import { CreateWithdrawal, Withdrawal } from "../interfaces/Withdrawal";
import { Sale } from "../interfaces/Sale";
import { CreateImbalanceLog, ImbalanceLog } from "interfaces/ImbalanceLog";

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

export const getAllCashRegisters = async (): Promise<CashRegisterTurns[]> => {
    const cashRegisters: CashRegisterTurns[] = await prisma.cash_Register.findMany({
        orderBy: {
            name: "asc"
        },
        select: QUERY_FOR_CASH_REGISTER_WITH_TURNS
    });
    return cashRegisters;
}

export const getCashRegisterById = async (id: string): Promise<CashRegisterTurns> => {
    const cashRegister: CashRegisterTurns = await prisma.cash_Register.findUnique({
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
    const turn = await prisma.turn.create({
        data: {
            date_time_start: turnData.date_time_start,
            base_cash: turnData.base_cash as number,
            user: {
                connect: {
                    id: userId
                }
            },
            cash_register: {
                connect: {
                    id: cashRegisterId
                }
            }
        },
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
    });
    const cashRegister: CashRegisterTurn = await prisma.cash_Register.findUnique({
        where: {
            id: cashRegisterId
        },
        select: {
            id: true,
            name: true,
            location: true,
        }
    });
    cashRegister.turn = turn;
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
        select: {
            id: true,
            name: true,
            location: true,
        }
    });
    const turnFound: Turn = await prisma.turn.findUnique({
        where: {
            id: turn.id
        },
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
    });
    cashRegister.turn = turnFound;
    return cashRegister;
}

export const registerImbalance = async (id_turn: string, imbalanceLog: CreateImbalanceLog): Promise<ImbalanceLog> => {
    const imbalanceLogSaved = await prisma.imbalance_Log.create({
        data: {
            value: imbalanceLog.value as number,
            description: imbalanceLog.description,
            turn: {
                connect: {
                    id: id_turn
                }
            }
        }
    });
    return imbalanceLogSaved;
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

export const getSalesByTurn = async (turnId: string): Promise<Sale[]> => {
    const sales: Sale[] = await prisma.sale.findMany({
        where: {
            id_turn: turnId
        },
        select: {
            id: true,
            date_sale: true,
            price_sale: true,
            person: false,
            oders: {
                select:{
                    id: true,
                    price: true,
                    amount_product: true,
                    product: {
                        select: {
                            id: true,
                            name_product: true,
                            measure_unit: true,
                            sale_price: true,
                            stock: true,
                            brand: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                }
            },
        }
    });
    return sales;
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

export const getWithdrawalsByTurnId = async (id: string): Promise<Withdrawal[]> => {
    const withdrawals: Withdrawal[] = await prisma.withdrawal.findMany({
        where: {
            id_turn: id
        }
    });
    return withdrawals;   
}

export const getWithdrawalsByCashRegisterId = async (id: string): Promise<Withdrawal[]> => {
    let withdrawals: any[] = await prisma.turn.findMany({
        where: {
            id_cash_register: id
        },
        select: {
            withdrawals: true
        }
    });
    withdrawals = withdrawals.map((withdrawal) => withdrawal.withdrawals).flat(); 
    return withdrawals;  
}

export const getAllWithdrawals = async (): Promise<Withdrawal[]> => {
    const withdrawals: Withdrawal[] = await prisma.withdrawal.findMany();
    return withdrawals;   
}

export const deleteWithdrawal = async (id: string): Promise<void> => {
    await prisma.withdrawal.deleteMany({
        where: {
            id_turn: id
        }
    });
}
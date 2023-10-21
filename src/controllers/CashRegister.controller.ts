import { Request, Response } from "express";
import { CashRegister, CashRegisterTurn, CashRegisterTurns, CreateCashRegister, CreateTurn, Turn, UpdateCashRegister, UpdateTurn } from "../interfaces/CashRegister";
import { closeTurn, createNewCashRegister, createTurn, createWithdrawal, deleteOneCashRegister, getAllCashRegisters, getCashRegisterById, getTurnById, updateCashRegister } from "../services/CashRegister.services";
import { CreateWithdrawal, UpdateWithdrawal, Withdrawal } from "interfaces/Withdrawal";

export const getAllCashRegister = async (req: Request, res: Response): Promise<Response> => {
    try {
        const cashRegisters: CashRegisterTurn[] = await getAllCashRegisters(); 
        return res.status(200).json(cashRegisters);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const getOneCashRegister = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const cashRegister: CashRegisterTurn = await getCashRegisterById(id);
        if (!cashRegister) return res.status(404).json({ message: "Cash register not found" });
        return res.status(200).json(cashRegister);
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const createCashRegister = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, location } = req.body;
        const newCashRegister: CreateCashRegister = {
            name, location
        }
        const cashRegister: CashRegister = await createNewCashRegister(newCashRegister);
        return res.status(201).json(cashRegister);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const updateOneCashRegister = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, name, location } = req.body;
        const cashRegister: CashRegisterTurn = await getCashRegisterById(id);
        if (!cashRegister) return res.status(404).json({ message: "Cash register not found" });
        const partialCashRegister: UpdateCashRegister = {
            id, name, location
        }
        const cashRegisterUpdated: CashRegister = await updateCashRegister(partialCashRegister);
        return res.status(200).json(cashRegisterUpdated);
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const openTurnForCashRegister = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id_cash = req.params.id;
        const cashRegister: CashRegisterTurn = await getCashRegisterById(id_cash);
        if (!cashRegister) return res.status(404).json({ message: "Cash register not found" });
        const { date_time_start, base_cash, id_user } = req.body;
        const turn: CreateTurn = { date_time_start, base_cash }
        const result:CashRegisterTurn = await createTurn(id_cash, id_user, turn);
        return res.status(200).json(result);
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const closeTurnForCashRegister = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id_cash = req.params.id;
        const cashRegisterFound: CashRegisterTurn = await getCashRegisterById(id_cash);
        if (!cashRegisterFound) return res.status(404).json({ message: "Cash register not found" });
        const { id_turn, date_time_end, final_cash } = req.body;
        const PartialTurn: UpdateTurn = { id: id_turn, date_time_end, final_cash }
        const cashRegister: CashRegisterTurn = await closeTurn(id_cash, PartialTurn);
        return res.status(200).json(cashRegister);
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const saveWithdrawal = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id_turn = req.params.id;
        const turnFound: Turn = await getTurnById(id_turn);
        if (!turnFound) return res.status(404).json({ message: "Turn not found" });
        const { withdrawal_date, value } = req.body;
        const partialWithdrawal: CreateWithdrawal = { withdrawal_date, value }
        const withdrawal: Withdrawal = await createWithdrawal(id_turn, partialWithdrawal);
        return res.status(200).json(withdrawal);
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const deleteCashRegister = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        const cashRegister: CashRegisterTurns = await getCashRegisterById(id);
        if (!cashRegister) return res.status(404).json({ message: "Cash register not found" });
        await deleteOneCashRegister(id, cashRegister.turns);
        return res.status(204).json({ message: "Cash register deleted" });
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}
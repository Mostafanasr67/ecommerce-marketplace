import type { Request, Response } from "express";
import {
    getAllCards as getAllCardsService,
    createCard as createCardService,
    deleteCard as deleteCardService,
    setDefaultCard as setDefaultCardService
} from "../services/card.service.js";

async function getAllCards(req: Request, res: Response) {
    // Get the logged-in user's saved cards and default card id
    const userId = req.user?.id as string;
    const cards = await getAllCardsService(userId);
    res.json(cards);
}

async function createCard(req: Request, res: Response) {
    // Save a new card for the logged-in user
    const userId = req.user?.id as string;
    const card = await createCardService(req.body, userId);
    res.status(201).json(card);
}

async function deleteCard(req: Request, res: Response) {
    // Delete card by ID
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const card = await deleteCardService(id, userId);
    res.json(card);
}

async function setDefaultCard(req: Request, res: Response) {
    // Mark one of the logged-in user's cards as default
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const card = await setDefaultCardService(id, userId);
    res.json(card);
}

export {
    getAllCards,
    createCard,
    deleteCard,
    setDefaultCard
};

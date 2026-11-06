import type {Request, Response} from "express"; 
import { createOrder as createOrderService, getOrders as getOrdersService, getOrderById as getOrderByIdService } from "../services/order.service.js";
import AppError from "../utils/appError.js";

function getAuthenticatedUserId(req: Request): string {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    return userId;
}

async function createOrder(req: Request, res: Response) {
    const userId = getAuthenticatedUserId(req);
    const order = await createOrderService(userId, req.body);
    res.status(201).json(order);
}

async function getOrders(req: Request, res: Response) {
    const userId = getAuthenticatedUserId(req);
    const orders = await getOrdersService(userId);
    res.status(200).json(orders);
}

async function getOrderById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const userId = getAuthenticatedUserId(req);
    const order = await getOrderByIdService(id, userId);
    res.status(200).json(order);
}

export { createOrder, getOrders, getOrderById };
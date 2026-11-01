import type {Request, Response} from "express"; 
import { createOrder as createOrderService, getOrders as getOrdersService, getOrderById as getOrderByIdService } from "../services/order.service.js";

async function createOrder(req: Request, res: Response) {
    const userId = req.user?.id as string;
    const order = await createOrderService(userId, req.body);
    res.status(201).json(order);
}

async function getOrders(req: Request, res: Response) {
    const orders = await getOrdersService();
    res.status(200).json(orders);
}

async function getOrderById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const order = await getOrderByIdService(id);
    res.status(200).json(order);
}

export { createOrder, getOrders, getOrderById };
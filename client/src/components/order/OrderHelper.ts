import type { Order, OrderItem, SellerOrder, Payment } from "../../types/order";
const API_URL = "http://localhost:5000";


type CreateOrderInput = {
    addressId: string;
    paymentMethod: "COD" | "ONLINE";
    cardId?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? body?.error ?? `Request failed with status ${res.status}`);
    }
    return res.json() as Promise<T>;
}

async function fetchOrders(): Promise<Order[]> {
    return request<Order[]>("/orders");
}

async function fetchOrderById(id: string): Promise<Order> {
    return request<Order>(`/orders/${id}`);
}

async function createOrder(data: CreateOrderInput): Promise<Order> {
    return request<Order>("/orders", {
        method: "POST",
        body: JSON.stringify(data),
    });
}


export {
    fetchOrders,
    fetchOrderById,
    createOrder,
};

export type { Order, OrderItem, SellerOrder, Payment, CreateOrderInput };

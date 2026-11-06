import type { Seller, SellerOrder, SellerProduct } from "../../types/seller";

const API_URL = 'http://localhost:5000';

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

async function fetchSeller(userId: string) {
    return request<Seller>(`/seller/${encodeURIComponent(userId)}`);
}

async function fetchSellerProducts(sellerId: string) {
    return request<SellerProduct[]>(`/seller/${encodeURIComponent(sellerId)}/products`);
}

async function fetchSellerOrders(sellerId: string) {
    return request<SellerOrder[]>(`/seller/${encodeURIComponent(sellerId)}/orders`);
}

export { fetchSeller, fetchSellerProducts, fetchSellerOrders };

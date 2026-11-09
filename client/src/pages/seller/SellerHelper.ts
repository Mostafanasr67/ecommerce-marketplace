import type { Seller, SellerOrder, SellerProduct } from "../../types/seller";

const API_URL = 'http://localhost:5000';

type ProductCategory = {
    id: string;
    name: string;
};

type SellerProductCreate = {
    name: string;
    description: string | null;
    price: number;
    stock: number;
    categoryId: string;
    discountType: "PERCENT" | "FIXED" | null;
    discountValue: number | null;
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

async function fetchSeller(userId: string) {
    return request<Seller>(`/seller/${encodeURIComponent(userId)}`);
}

async function updateSellerStoreName(sellerId: string, storeName: string, expectedUpdatedAt: string) {
    return request<Seller>(`/seller/${encodeURIComponent(sellerId)}`, {
        method: "PATCH",
        body: JSON.stringify({ storeName, expectedUpdatedAt }),
    });
}

async function fetchSellerProducts(sellerId: string) {
    return request<SellerProduct[]>(`/seller/${encodeURIComponent(sellerId)}/products`);
}

async function fetchProductCategories() {
    return request<ProductCategory[]>("/categories");
}

async function createSellerProduct(product: SellerProductCreate) {
    return request<{ id: string }>("/products", {
        method: "POST",
        body: JSON.stringify(product),
    });
}

async function updateSellerProductStock(sellerId: string, productId: string, expectedStock: number, stock: number) {
    return request<Pick<SellerProduct, "id" | "stock">>(
        `/seller/${encodeURIComponent(sellerId)}/products/${encodeURIComponent(productId)}/stock`,
        { method: "PATCH", body: JSON.stringify({ expectedStock, stock }) },
    );
}

type SellerProductDetails = {
    name: string;
    price: number;
    categoryId: string;
    discountType: "PERCENT" | "FIXED" | null;
    discountValue: number | null;
    expectedUpdatedAt: string;
};

async function updateSellerProductDetails(sellerId: string, productId: string, details: SellerProductDetails) {
    return request<{ id: string }>(
        `/seller/${encodeURIComponent(sellerId)}/products/${encodeURIComponent(productId)}/details`,
        { method: "PATCH", body: JSON.stringify(details) },
    );
}

async function fetchSellerOrders(sellerId: string) {
    return request<SellerOrder[]>(`/seller/${encodeURIComponent(sellerId)}/orders`);
}

async function updateSellerOrderStatus(sellerId: string, orderId: string, status: SellerOrder["status"]) {
    return request<Pick<SellerOrder, "id" | "status">>(
        `/seller/${encodeURIComponent(sellerId)}/orders/${encodeURIComponent(orderId)}/status`,
        { method: "PATCH", body: JSON.stringify({ status }) },
    );
}

export { fetchSeller, updateSellerStoreName, fetchSellerProducts, fetchProductCategories, createSellerProduct, fetchSellerOrders, updateSellerOrderStatus, updateSellerProductStock, updateSellerProductDetails };
export type { ProductCategory, SellerProductCreate, SellerProductDetails };

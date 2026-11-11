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
    images: ProductImageAsset[];
};

type ProductImageAsset = {
    url: string;
    publicId: string;
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

async function uploadSellerProductImage(file: File): Promise<ProductImageAsset> {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);
    const headers: HeadersInit = {};
    if (token) headers.Authorization = "Bearer " + token;
    const response = await fetch(`${API_URL}/products/images`, {
        method: "POST",
        headers,
        body: formData,
    });
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? body?.error ?? `Image upload failed with status ${response.status}`);
    }
    return response.json() as Promise<ProductImageAsset>;
}

async function deleteSellerProductImage(publicId: string) {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers.Authorization = "Bearer " + token;
    const response = await fetch(`${API_URL}/products/images`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ publicId }),
    });
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? body?.error ?? `Image cleanup failed with status ${response.status}`);
    }
}

async function updateSellerProductImages(
    sellerId: string,
    productId: string,
    expectedUpdatedAt: string,
    images: ({ id: string } | ProductImageAsset)[],
) {
    return request<{ id: string; updatedAt: string }>(
        `/seller/${encodeURIComponent(sellerId)}/products/${encodeURIComponent(productId)}/images`,
        { method: "PATCH", body: JSON.stringify({ expectedUpdatedAt, images }) },
    );
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

export { fetchSeller, updateSellerStoreName, fetchSellerProducts, fetchProductCategories, createSellerProduct, uploadSellerProductImage, deleteSellerProductImage, updateSellerProductImages, fetchSellerOrders, updateSellerOrderStatus, updateSellerProductStock, updateSellerProductDetails };
export type { ProductCategory, ProductImageAsset, SellerProductCreate, SellerProductDetails };

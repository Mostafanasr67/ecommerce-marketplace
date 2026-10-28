import type { CartItem, CartItemView } from "../../types/cart";


const API_URL = "http://localhost:5000";

type ApiCartResponse = {
    cart: { id: string; cartItems: CartItem[] } | null;
    total: { total: number | string };
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
        throw new Error(body?.message ?? `Request failed with status ${res.status}`);
    }
    return res.json() as Promise<T>;
}

async function fetchCartItems(): Promise<CartItemView[]> {
    const data = await request<ApiCartResponse>("/cart");
    return (data.cart?.cartItems ?? []).map(toCartItemView);
}

async function addCartItem(productId: string, quantity: number) {
    return request(`/cart/add`, {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
    });
}

function updateCartItemQuantity(productId: string, quantity: number) {
    return request(`/cart/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
    });
}

function removeCartItem(productId: string) {
    return request(`/cart/${productId}`, { method: "DELETE" });
}

// The API returns Prisma Decimal prices as strings, so convert them here.
// Display-only fields have no schema column and get defaults.
function toCartItemView(item: CartItem): CartItemView {
    return {
        ...item,
        product: { ...item.product, price: Number(item.product.price) },
        category: "",
        image: "",
        badge: "",
        badgeClassName: "",
        packageId: "sovereign",
    };
}


export {
    fetchCartItems,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
    toCartItemView,
};
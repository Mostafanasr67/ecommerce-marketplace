import type { Product } from "../../../types/cart";

const API_URL = "http://localhost:5000";

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

async function fetchProductsByIds(productIds: string[]): Promise<Product[]> {
	if (productIds.length === 0) return [];
	
	const params = new URLSearchParams();
	productIds.forEach(id => params.append("ids", id));
	
	const data = await request<{ products: Product[] }>(`/products?${params.toString()}`);
	return data.products ?? [];
}

async function fetchProductById(productId: string): Promise<Product> {
	const data = await request<{ product: Product }>(`/products/${productId}`);
	return data.product;
}

async function fetchWishlist(): Promise<Product[]> {
	const data = await request<{ wishlist: { product: Product }[] }>(`/wishlist`);
	return (data.wishlist ?? []).map(item => item.product);
}

async function addToWishlist(productId: string): Promise<void> {
	await request(`/wishlist/add`, {
		method: "POST",
		body: JSON.stringify({ productId }),
	});
}

async function removeFromWishlist(productId: string): Promise<void> {
	await request(`/wishlist/${productId}`, {
		method: "DELETE",
	});
}

export {
	fetchProductsByIds,
	fetchProductById,
	fetchWishlist,
	addToWishlist,
	removeFromWishlist,
};

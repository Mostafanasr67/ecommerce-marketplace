import type { ProductReviewsResponse, Review, SaveReviewInput } from "../../../types/review";

const API_URL = "http://localhost:5000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const token = localStorage.getItem("token");
	const response = await fetch(`${API_URL}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	});
	if (!response.ok) {
		const body = await response.json().catch(() => null);
		throw new Error(body?.message ?? body?.error ?? `Request failed with status ${response.status}`);
	}
	return response.json() as Promise<T>;
}

async function fetchProductReviews(productId: string) {
	return request<ProductReviewsResponse>(`/reviews/${encodeURIComponent(productId)}`);
}

async function fetchMyProductReview(productId: string) {
	return request<Review | null>(`/reviews/${encodeURIComponent(productId)}/mine`);
}

async function saveProductReview(productId: string, review: SaveReviewInput) {
	return request<Review>(`/reviews/${encodeURIComponent(productId)}`, {
		method: "PUT",
		body: JSON.stringify(review),
	});
}

export { fetchProductReviews, fetchMyProductReview, saveProductReview };

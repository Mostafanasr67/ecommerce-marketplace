const API_URL = "http://localhost:5000";

// Mirrors the Card model in server/prisma/schema.prisma. The full card number and CVV are never returned.
type SavedCard = {
	id: string;
	userId: string;
	holderName: string;
	brand: string;
	last4: string;
	expiryMonth: number;
	expiryYear: number;
	createdAt: string;
	updatedAt: string;
};

type CardInput = {
	holderName: string;
	cardNumber: string;
	expiryMonth: number;
	expiryYear: number;
	cvv: string;
};

type CardsResponse = {
	cards: SavedCard[];
	defaultCardId: string | null;
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
		throw new Error(body?.error ?? body?.message ?? `Request failed with status ${res.status}`);
	}
	return res.json() as Promise<T>;
}

async function fetchCards(): Promise<CardsResponse> {
	return request<CardsResponse>("/cards");
}

async function createCard(data: CardInput): Promise<SavedCard> {
	return request<SavedCard>("/cards", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

async function deleteCard(id: string): Promise<SavedCard> {
	return request<SavedCard>(`/cards/${id}`, { method: "DELETE" });
}

// Marks the card as the user's default. The server stores it on User.defaultCardId.
async function setDefaultCard(id: string): Promise<SavedCard> {
	return request<SavedCard>(`/cards/${id}/default`, { method: "PATCH" });
}

export {
	fetchCards,
	createCard,
	deleteCard,
	setDefaultCard,
};

export type { SavedCard, CardInput, CardsResponse };

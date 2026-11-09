interface StoredUser {
	id: string;
	email?: string;
	role?: string;
	[key: string]: unknown;
}

interface StoredSeller extends StoredUser {
	sellerId?: string;
}

/**
 * Get current user from localStorage
 * @returns Parsed user object or null if not found
 */
function getCurrentUser(): StoredUser | null {
	const userJson = localStorage.getItem("user");
	if (!userJson) return null;

	try {
		return JSON.parse(userJson) as StoredUser;
	} catch (error) {
		console.error("Failed to parse user from localStorage:", error);
		return null;
	}
}

/**
 * Get current user ID from localStorage
 * @returns User ID or null if not found
 */
function getCurrentUserId(): string | null {
	const user = getCurrentUser();
	return user?.id || null;
}

/**
 * Get current seller ID from database using user ID from localStorage
 * Fetches the seller record from the database using the user ID
 * @returns Seller ID or null if not found
 */
async function getCurrentSellerId(): Promise<string | null> {
	try {
		const userId = getCurrentUserId();
		
		if (!userId) {
			console.warn("No user ID found in localStorage");
			return null;
		}

		// Fetch seller from database using userId
		const token = localStorage.getItem("token");
		const API_URL = 'http://localhost:5000';
		
		const response = await fetch(`${API_URL}/seller/${encodeURIComponent(userId)}`, {
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch seller: ${response.status}`);
		}

		const seller = await response.json();
		return seller?.id || null;
	} catch (error) {
		console.error("Error fetching seller ID:", error);
		return null;
	}
}

/**
 * Get current seller info from localStorage
 * @returns Seller object or null if not found
 */
function getCurrentSeller(): StoredSeller | null {
	return getCurrentUser() as StoredSeller | null;
}

export { getCurrentUser, getCurrentUserId, getCurrentSellerId, getCurrentSeller };
export type { StoredUser, StoredSeller };

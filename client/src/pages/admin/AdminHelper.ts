import type {
	AdminCategory,
	AdminFilterOptions,
	AdminIdentity,
	AdminOrder,
	AdminOverview,
	AdminPageResult,
	AdminProduct,
	AdminSeller,
	AdminUser,
} from "../../types/admin";

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

function queryString(params: Record<string, string | number | undefined>) {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== "") search.set(key, String(value));
	}
	return search.toString();
}

async function fetchAdminIdentity() {
	return request<AdminIdentity>("/auth/me");
}

async function fetchAdminOverview() {
	return request<AdminOverview>("/admin/overview");
}

async function fetchAdminUsers(params: { page: number; search: string }) {
	return request<AdminPageResult<AdminUser>>(`/admin/users?${queryString({ ...params, limit: 10 })}`);
}

async function fetchAdminSellers(params: { page: number; search: string }) {
	return request<AdminPageResult<AdminSeller>>(`/admin/sellers?${queryString({ ...params, limit: 10 })}`);
}

async function fetchAdminProducts(params: { page: number; search: string; categoryId: string; sellerId: string; availability: string }) {
	return request<AdminPageResult<AdminProduct>>(`/admin/products?${queryString({ ...params, limit: 10 })}`);
}

async function fetchAdminCategories() {
	return request<AdminCategory[]>("/admin/categories");
}

async function fetchAdminOrders(params: { page: number; limit: number; search: string; status: string; paymentStatus: string; dateFrom: string; dateTo: string }) {
	return request<AdminPageResult<AdminOrder>>(`/admin/orders?${queryString(params)}`);
}

async function updateAdminOrderStatus(orderId: string, status: AdminOrder["status"]) {
	return request<{ id: string; status: AdminOrder["status"] }>(`/admin/orders/${encodeURIComponent(orderId)}/status`, {
		method: "PATCH",
		body: JSON.stringify({ status }),
	});
}

async function fetchAdminFilterOptions() {
	return request<AdminFilterOptions>("/admin/filter-options");
}

async function createCategory(name: string) {
	return request<AdminCategory>("/categories", { method: "POST", body: JSON.stringify({ name }) });
}

async function updateCategory(id: string, name: string) {
	return request<AdminCategory>(`/categories/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ name }) });
}

async function deleteCategory(id: string) {
	return request<AdminCategory>(`/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export {
	fetchAdminIdentity,
	fetchAdminOverview,
	fetchAdminUsers,
	fetchAdminSellers,
	fetchAdminProducts,
	fetchAdminCategories,
	fetchAdminOrders,
	updateAdminOrderStatus,
	fetchAdminFilterOptions,
	createCategory,
	updateCategory,
	deleteCategory,
};

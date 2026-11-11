export type AdminIdentity = {
	id: string;
	name: string | null;
	email: string;
	role: string;
};

export type AdminPageResult<T> = {
	items: T[];
	pagination: {
		page: number;
		limit: number;
		totalCount: number;
		totalPages: number;
	};
};

export type AdminOverview = {
	stats: {
		totalSales: string | number;
		totalOrders: number;
		totalUsers: number;
		totalProducts: number;
	};
	recentOrders: AdminOrder[];
	activity: { id: string; kind: "user" | "seller" | "product" | "order"; label: string; createdAt: string }[];
};

export type AdminUser = {
	id: string;
	name: string | null;
	email: string;
	role: "USER" | "SELLER" | "ADMIN";
	createdAt: string;
	seller: { storeName: string } | null;
};

export type AdminSeller = {
	id: string;
	userId: string;
	storeName: string;
	createdAt: string;
	user: { id: string; name: string | null; email: string };
	_count: { products: number };
};

export type AdminCategory = {
	id: string;
	name: string;
	createdAt: string;
	_count: { products: number };
};

export type AdminProduct = {
	id: string;
	name: string;
	description: string | null;
	price: string | number;
	stock: number;
	createdAt: string;
	category: { id: string; name: string };
	seller: { id: string; storeName: string; user: { name: string | null; email: string } };
	productImages: { id: string; url: string; publicId?: string | null; altText: string }[];
};

export type AdminOrder = {
	id: string;
	status: string;
	totalAmount: string | number;
	createdAt: string;
	fullname: string;
	phone: string;
	street: string;
	city: string;
	area: string;
	country: string;
	building: string;
	apartment: string;
	user: { id: string; name: string | null; email: string };
	payment: { id: string; method: string; status: string; amount: string | number } | null;
	itemCount?: number;
	sellerOrders: {
		id: string;
		status: string;
		subTotal: string | number;
		seller: { id: string; storeName: string };
		orderItems: {
			id: string;
			productId: string;
			quantity: number;
			unitPrice: string | number;
			product: { id: string; name: string; productImages: { id: string; url: string }[] };
		}[];
	}[];
};

export type AdminFilterOptions = {
	categories: { id: string; name: string }[];
	sellers: { id: string; storeName: string }[];
};

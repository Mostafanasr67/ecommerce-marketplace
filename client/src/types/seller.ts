type Seller = {
	id: string;
	userId: string;
	storeName: string;
	createdAt: string;
	updatedAt: string;
};

type SellerProduct = {
	id: string;
	sellerId: string;
	categoryId: string;
	name: string;
	description: string | null;
	price: string;
	stock: number;
	createdAt: string;
	updatedAt: string;
	category: { id: string; name: string };
	productImages: { id: string; url: string; altText: string; sortOrder: number }[];
};

type SellerOrder = {
	id: string;
	orderId: string;
	sellerId: string;
	status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
	subTotal: string;
	createdAt: string;
	updatedAt: string;
	order: {
		id: string;
		fullname: string;
		city: string;
		area: string;
		payment: { method: "COD" | "ONLINE"; status: string; amount: string } | null;
	};
	orderItems: {
		id: string;
		productId: string;
		quantity: number;
		unitPrice: string;
		product: SellerProduct;
	}[];
};

export type { Seller, SellerOrder, SellerProduct };

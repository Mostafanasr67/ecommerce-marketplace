// Mirrors the Prisma `Product` model (server/prisma/schema.prisma).
export type Product = {
	id: string;
	sellerId: string;
	categoryId: string;
	name: string;
	description: string | null;
	price: number;
	stock: number;
	createdAt: string;
	updatedAt: string;
};

// Mirrors the Prisma `CartItem` model.
export type CartItem = {
	id: string;
	cartId: string;
	productId: string;
	quantity: number;
	createdAt: string;
	updatedAt: string;
	product: Product;
};

// Display-only fields used by the cart UI. These are not schema columns.
export type CartItemView = CartItem & {
	originalPrice?: number;
	image: string;
	badge: string;
	badgeClassName: string;
	category: string;
	packageId: "sovereign" | "merchant";
};

export type CartPackage = {
	id: CartItemView["packageId"];
	title: string;
	delivery: string;
	seller: string;
	sellerNote: string;
	headerClassName: string;
	sellerClassName: string;
	items: CartItemView[];
};

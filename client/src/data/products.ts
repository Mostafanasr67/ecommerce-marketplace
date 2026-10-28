export type Product = {
	id: string;
	name: string;
	category: string;
	image: string;
	price: number;
	oldPrice?: number;
	rating: number;
	seller: string;
	badge?: string;
};

export const products = [
	{
		id: "abddd8a0-6f79-4bba-9fb5-1b983929b672",
		name: "Wireless Noise-Cancelling Headphones",
		category: "Electronics",
		image:
			"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
		price: 2499,
		oldPrice: 3299,
		rating: 4.8,
		seller: "Tech Haven",
		badge: "Best Seller",
	},
	{
		id: "e0a0dfc2-e7e5-47e6-b4be-843626bb861e",
		name: "Minimal Everyday Sneakers",
		category: "Fashion",
		image:
			"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
		price: 1899,
		rating: 4.6,
		seller: "Urban Steps",
		badge: "Trending",
	},
	{
		id: "0bad12a8-b0ed-40ea-b290-d3c99fc5f34c",
		name: "Classic Everyday Wristwatch",
		category: "Fashion",
		image:
			"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
		price: 3299,
		oldPrice: 3999,
		rating: 4.7,
		seller: "Time & Co.",
	},
	{
		id: "e1e0bdd6-0bf5-415c-97fe-34a22ef9e040",
		name: "Modern Ceramic Home Vase",
		category: "Home & Living",
		image:
			"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=80",
		price: 899,
		rating: 4.5,
		seller: "Cairo Crafts",
		badge: "Local Seller",
	},
];
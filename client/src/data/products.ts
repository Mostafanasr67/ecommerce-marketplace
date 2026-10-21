export type Product = {
	id: number;
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
		id: 1,
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
		id: 2,
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
		id: 3,
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
		id: 4,
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
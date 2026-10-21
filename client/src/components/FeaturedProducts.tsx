import ProductCard from "./ProductCard";

type FeaturedProductsProps = {
	searchQuery: string;
	categoryQuery: string;
	wishlist: number[];
	toggleWishlist: (productId: number) => void;
};

type Product = {
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

const products = [
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

function FeaturedProducts({
	searchQuery,
	categoryQuery,
	wishlist,
	toggleWishlist,
}: FeaturedProductsProps) {
	return (
		<section
			id="featured-catalog"
			className="mx-auto w-full max-w-7xl px-margin py-space-xl"
		>
			<div className="mb-space-lg flex items-end justify-between gap-space-md">
				<div>
					<p className="mb-space-xs text-label-sm font-bold uppercase tracking-wider text-primary">
						Handpicked for you
					</p>

					<h2 className="text-headline-md font-bold text-on-surface">
						Featured Products
					</h2>

					<p className="mt-space-sm text-body-md text-on-surface-variant">
						Discover popular picks from trusted sellers.
					</p>
				</div>

				<a
					href="#"
					className="shrink-0 text-label-md font-semibold text-primary hover:underline"
				>
					View all →
				</a>
			</div>

			<div className="grid grid-cols-2 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
				{(() => {
					const filteredProducts = products.filter(
						(product) =>
							product.id !== 0 && // Exclude "All Products"
							(product.name
								.toLowerCase()
								.includes(searchQuery.trim().toLowerCase()) ||
								(product.seller
									?.toLowerCase?.()
									.includes(searchQuery.trim().toLowerCase()) ??
									false)) &&
							(categoryQuery === "" || product.category === categoryQuery),
					) as Product[];

					return (
						<>
							{filteredProducts.map((product) => (
								<ProductCard
									key={product.id}
									{...product}
									wishlist={wishlist}
									toggleWishlist={toggleWishlist}
								/>
							))}
							{filteredProducts.length === 0 && (
								<p className="py-space-xl text-center text-body-md text-on-surface-variant">
									No products found. Try another search.
								</p>
							)}
						</>
					);
				})()}
			</div>
		</section>
	);
}

export default FeaturedProducts;

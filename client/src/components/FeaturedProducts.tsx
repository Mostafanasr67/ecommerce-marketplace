import ProductCard from "./ProductCard";
import { products } from "../data/products";
import type { Product } from "../data/products";

type FeaturedProductsProps = {
	searchQuery: string;
	categoryQuery: string;
	wishlist: number[];
	toggleWishlist: (productId: number) => void;
};



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

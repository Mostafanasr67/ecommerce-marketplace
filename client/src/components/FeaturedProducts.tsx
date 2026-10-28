import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { useEffect, useState, useRef } from "react";

type FeaturedProductsProps = {
	searchQuery: string;
	categoryQuery: string;
	wishlist: string[];
	toggleWishlist: (productId: string) => void;
};

function FeaturedProducts({
	searchQuery,
	categoryQuery,
	wishlist,
	toggleWishlist,
}: FeaturedProductsProps) {
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		// Clear previous timeout
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		const fetchProducts = async () => {
			setIsLoading(true);
			setError(null);
			try {
				// Build the URL with search query if provided
				const url = searchQuery.trim() || categoryQuery
					? `http://localhost:5000/products?search=${searchQuery}&categoryId=${categoryQuery}`
					: `http://localhost:5000/products`;

				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setFilteredProducts(data.products || []);
			} catch (error) {
				console.error("Error fetching products:", error);
				setError(
					error instanceof Error ? error.message : "Failed to fetch products",
				);
				setFilteredProducts([]);
			} finally {
				setIsLoading(false);
			}
		};

		// Set new timeout - wait 500ms after user stops typing
		debounceTimeoutRef.current = setTimeout(() => {
			fetchProducts();
		}, 500);

		// Cleanup on unmount
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, [searchQuery, categoryQuery]);

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

				<Link
					to="/products"
					className="shrink-0 text-label-md font-semibold text-primary hover:underline"
				>
					View all →
				</Link>
			</div>

			<div className="grid grid-cols-2 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
				{isLoading && (
					<div className="col-span-full py-space-xl text-center">
						<p className="text-body-md text-on-surface-variant">
							Loading products...
						</p>
					</div>
				)}

				{error && (
					<div className="col-span-full py-space-xl text-center">
						<p className="text-body-md text-error">Error: {error}</p>
					</div>
				)}

				{!isLoading && !error && filteredProducts.length === 0 && (
					<div className="col-span-full py-space-xl text-center">
						<p className="text-body-md text-on-surface-variant">
							No products found. Try another search.
						</p>
					</div>
				)}

				{!isLoading &&
					!error &&
					filteredProducts.map((product) => (
						<ProductCard
							key={product.id}
							{...product}
							wishlist={wishlist}
							toggleWishlist={toggleWishlist}
						/>
					))}
			</div>
		</section>
	);
}

export default FeaturedProducts;

import ProductCard from "../products/ProductCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../../types/cart";

type RecentProduct = Product & {
	averageRating?: number;
	reviewCount?: number;
};

function useRecentProducts() {
	const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("http://localhost:5000/products?limit=4&page=1&sortBy=createdAt&sortOrder=desc")
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to load recent products (${res.status})`);
				}
				return res.json();
			})
			.then((data) => {
				setRecentProducts(data.products ?? []);
			})
			.catch((fetchError: unknown) => {
				console.error("Failed to load recently added products:", fetchError);
				setError("Recently added products could not be loaded.");
			});
	}, []);

	return { recentProducts, error };
}

type RecentlyAddedProps = {
	wishlist: string[];
	toggleWishlist: (productId: string) => void;
};

function RecentlyAdded({ wishlist, toggleWishlist }: RecentlyAddedProps) {
	const { recentProducts, error } = useRecentProducts();
	return (
		<section className="mx-auto w-full max-w-7xl px-margin py-space-xl">
			<div className="mb-space-lg flex items-end justify-between gap-space-md">
				<div>
					<p className="mb-space-xs text-label-sm font-bold uppercase tracking-wider text-primary">
						Fresh finds
					</p>

					<h2 className="text-headline-md font-bold text-on-surface">
						Recently Added
					</h2>

					<p className="mt-space-sm text-body-md text-on-surface-variant">
						Explore the latest products from our sellers.
					</p>
				</div>

				<Link
					to="/products"
					className="shrink-0 text-label-md font-semibold text-primary hover:underline"
				>
					View all →
				</Link>
			</div>

			<div className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
				{error && (
					<p role="alert" className="col-span-full text-center text-body-md text-error">
						{error}
					</p>
				)}
				{recentProducts.map((product) => (
					<ProductCard
						key={product.id}
						id={product.id}
						name={product.name}
						image={product.productImages?.[0]?.url}
						price={product.price}
						originalPrice={product.originalPrice}
						rating={product.averageRating}
						reviewCount={product.reviewCount}
						seller={product.seller?.storeName ?? "Marketplace"}
						wishlist={wishlist}
						toggleWishlist={toggleWishlist}
					/>
				))}
			</div>
		</section>
	);
}

export default RecentlyAdded;

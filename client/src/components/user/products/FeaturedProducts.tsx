import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

type CatalogProduct = {
	id: string;
	name: string;
	price: number | string;
	originalPrice?: number | string;
	averageRating: number;
	reviewCount: number;
	seller?: { storeName: string };
	productImages?: { url: string }[];
};

type ProductPage = {
	products: CatalogProduct[];
	pagination: {
		page: number;
		totalPages: number;
	};
};

type FeaturedProductsProps = {
	searchQuery: string;
	categoryQuery: string;
	wishlist: string[];
	toggleWishlist: (productId: string) => void;
	productsPerPage?: number;
};

const DEFAULT_PRODUCTS_PER_PAGE = 12;

async function fetchProductsPage(searchQuery: string, categoryQuery: string, page: number, productsPerPage: number): Promise<ProductPage> {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(productsPerPage),
	});
	const search = searchQuery.trim();
	if (search) params.set("search", search);
	if (categoryQuery === "Deals") {
		params.set("hasDiscount", "true");
	} else if (categoryQuery) {
		params.set("categoryId", categoryQuery);
	}

	const response = await fetch(`http://localhost:5000/products?${params.toString()}`);
	if (!response.ok) throw new Error(`Failed to load products (${response.status})`);
	return response.json() as Promise<ProductPage>;
}

function FeaturedProducts({
	searchQuery,
	categoryQuery,
	wishlist,
	toggleWishlist,
	productsPerPage = DEFAULT_PRODUCTS_PER_PAGE,
}: FeaturedProductsProps) {
	const productsQuery = useInfiniteQuery({
		queryKey: ["products", searchQuery, categoryQuery, productsPerPage],
		queryFn: ({ pageParam }) => fetchProductsPage(searchQuery, categoryQuery, pageParam, productsPerPage),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.page < lastPage.pagination.totalPages
				? lastPage.pagination.page + 1
				: undefined,
	});
	const products = productsQuery.data?.pages.flatMap((page) => page.products) ?? [];
	const isDealsCategory = categoryQuery === "Deals";

	return (
		<section
			id="featured-catalog"
			className="mx-auto w-full max-w-7xl px-margin py-space-xl"
		>
			<div className="mb-space-lg flex items-end justify-between gap-space-md">
				<div>
					<p className="mb-space-xs text-label-sm font-bold uppercase tracking-wider text-primary">
						{isDealsCategory ? "Special offers" : "Handpicked for you"}
					</p>

					<h2 className="text-headline-md font-bold text-on-surface">
						{isDealsCategory ? "Deals" : "Featured Products"}
					</h2>

					<p className="mt-space-sm text-body-md text-on-surface-variant">
						{isDealsCategory ? "Products currently available with a discount." : "Discover popular picks from trusted sellers."}
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
				{productsQuery.isPending && (
					<div className="col-span-full py-space-xl text-center">
						<p className="text-body-md text-on-surface-variant">Loading products...</p>
					</div>
				)}

				{productsQuery.isError && (
					<div className="col-span-full py-space-xl text-center">
						<p role="alert" className="text-body-md text-error">Error: {productsQuery.error.message}</p>
					</div>
				)}

				{!productsQuery.isPending && !productsQuery.isError && products.length === 0 && (
					<div className="col-span-full py-space-xl text-center">
						<p className="text-body-md text-on-surface-variant">
							{isDealsCategory ? "No discounted products are available right now." : "No products found. Try another search."}
						</p>
					</div>
				)}

				{products.map((product) => (
					<ProductCard
						key={product.id}
						id={product.id}
						name={product.name}
						image={product.productImages?.[0]?.url}
						price={Number(product.price)}
						originalPrice={product.originalPrice}
						rating={product.averageRating}
						reviewCount={product.reviewCount}
						seller={product.seller?.storeName ?? "Marketplace"}
						wishlist={wishlist}
						toggleWishlist={toggleWishlist}
					/>
				))}
			</div>

			{productsPerPage === DEFAULT_PRODUCTS_PER_PAGE && productsQuery.hasNextPage && (
				<div className="mt-space-lg flex justify-center">
					<button
						type="button"
						onClick={() => void productsQuery.fetchNextPage()}
						disabled={productsQuery.isFetchingNextPage}
						className="rounded-lg border border-outline-variant px-space-lg py-space-sm font-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-wait disabled:opacity-60"
					>
						{productsQuery.isFetchingNextPage ? "Loading..." : "Load more products"}
					</button>
				</div>
			)}
		</section>
	);
}

export default FeaturedProducts;

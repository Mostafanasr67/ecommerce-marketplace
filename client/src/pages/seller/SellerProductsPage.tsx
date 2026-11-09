import { useQuery, useQueryClient } from "@tanstack/react-query";
import SellerSidebar from "../../components/seller/dashboard/SellerSidebar";
import SellerTopBar from "../../components/seller/dashboard/SellerTopBar";
import ProductInventoryCard from "../../components/seller/products/ProductInventoryCard";
import AddProductDialog from "../../components/seller/products/AddProductDialog";
import type { SellerProduct } from "../../types/seller";
import { getCurrentUserId } from "../../utils/currentUser";
import { fetchSeller, fetchSellerProducts, fetchProductCategories, createSellerProduct, updateSellerProductStock, updateSellerProductDetails } from "./SellerHelper";
import type { SellerProductDetails } from "./SellerHelper";
import { useState } from "react";

function SellerProductsPage({ onLogout }: { onLogout: () => void }) {
	const [addingProduct, setAddingProduct] = useState(false);
	const userId = getCurrentUserId();
	const queryClient = useQueryClient();
	const sellerQuery = useQuery({
		queryKey: ["seller", userId],
		queryFn: () => {
			if (!userId) throw new Error("Your session has no user ID. Please log in again.");
			return fetchSeller(userId);
		},
		enabled: Boolean(userId),
	});
	const seller = sellerQuery.data;
	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: fetchProductCategories,
	});
	const productsKey = ["seller", userId, "products", seller?.id] as const;
	const productsQuery = useQuery({
		queryKey: productsKey,
		queryFn: () => {
			if (!seller) throw new Error("Seller profile is not available.");
			return fetchSellerProducts(seller.id);
		},
		enabled: Boolean(seller),
	});

	async function handleSaveStock(productId: string, expectedStock: number, stock: number) {
		if (!seller) throw new Error("Seller profile is not available.");
		try {
			const updated = await updateSellerProductStock(seller.id, productId, expectedStock, stock);
			queryClient.setQueryData<SellerProduct[]>(productsKey, (products) =>
				products?.map((product) => product.id === updated.id ? { ...product, stock: updated.stock } : product),
			);
		} finally {
			void queryClient.invalidateQueries({ queryKey: productsKey });
		}
	}

	async function handleSaveDetails(productId: string, details: SellerProductDetails) {
		if (!seller) throw new Error("Seller profile is not available.");
		try {
			await updateSellerProductDetails(seller.id, productId, details);
		} finally {
			await queryClient.invalidateQueries({ queryKey: productsKey });
		}
	}

	async function handleCreateProduct(product: Parameters<typeof createSellerProduct>[0]) {
		await createSellerProduct(product);
		await queryClient.invalidateQueries({ queryKey: productsKey });
	}

	const products = productsQuery.data;

	return (
		<div className="min-h-screen bg-background font-body-md text-on-surface antialiased">
			<SellerSidebar onLogout={onLogout} />
			<div className="min-h-screen pl-72">
				{seller && <SellerTopBar seller={seller} />}
				<main className="min-h-screen bg-surface pt-20">
					<div className="px-margin py-space-xl">
						<header className="border-b border-surface-container-low pb-space-lg">
							<div className="flex flex-wrap items-start justify-between gap-space-md">
								<div>
									<h1 className="font-headline-lg text-headline-lg text-on-surface">Products &amp; Inventory</h1>
									<p className="mt-space-xs font-body-md text-on-surface-variant">Manage your products, prices, discounts and stock levels.</p>
									{products && <p className="mt-space-md font-label-md text-on-surface-variant">{products.length} product{products.length === 1 ? "" : "s"}</p>}
								</div>
								<button type="button" onClick={() => setAddingProduct(true)} className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-primary-container px-space-lg font-label-lg text-on-primary shadow-sm transition-colors hover:bg-primary">
									<span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
									<span>Add product</span>
								</button>
							</div>
						</header>
						{addingProduct && (
							<AddProductDialog
								categories={categoriesQuery.data ?? []}
								categoriesLoading={categoriesQuery.isPending}
								categoriesError={categoriesQuery.isError ? `Failed to load categories: ${categoriesQuery.error.message}` : undefined}
								onClose={() => setAddingProduct(false)}
								onCreate={handleCreateProduct}
							/>
						)}
						<section aria-label="Your products" className="mt-space-lg">
							{!userId && <p role="alert" className="text-error">Your session has no user ID. Please log in again.</p>}
							{userId && sellerQuery.isPending && <p>Loading seller profile...</p>}
							{sellerQuery.isError && <p role="alert" className="text-error">Failed to load seller profile: {sellerQuery.error.message}</p>}
							{seller && productsQuery.isPending && <p>Loading products...</p>}
							{productsQuery.isError && <p role="alert" className="text-error">Failed to load products: {productsQuery.error.message}</p>}
							{categoriesQuery.isError && <p role="alert" className="text-error">Failed to load categories: {categoriesQuery.error.message}</p>}
							{products && (
								products.length === 0 ? (
									<p className="rounded-xl bg-surface-container-lowest p-space-lg text-on-surface-variant">You have no products yet.</p>
								) : (
									<div className="flex flex-col gap-space-md">
										{products.map((product) => <ProductInventoryCard key={product.id} product={product} categories={categoriesQuery.data ?? []} categoriesLoading={categoriesQuery.isPending} onSaveStock={handleSaveStock} onSaveDetails={handleSaveDetails} />)}
									</div>
								)
							)}
						</section>
					</div>
				</main>
			</div>
		</div>
	);
}

export default SellerProductsPage;

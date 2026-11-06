import { useEffect, useMemo, useState } from "react";
import type { CartItemView, Product } from "../../types/cart";

function CartRecommendations({
	items,
	onAdd,
}: {
	items: CartItemView[];
	onAdd: (productId: string) => Promise<void>;
}) {

	const [recommendations, setRecommendations] = useState<Product[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [addingProductId, setAddingProductId] = useState<string | null>(null);

	const categoryIds = useMemo(
		() => [...new Set(items.map((item) => item.product.categoryId))],
		[items],
	);
	const categoryIdsParam = categoryIds.join(",");
	const cartProductIdsParam = useMemo(
		() => [...new Set(items.map((item) => item.productId))].join(","),
		[items],
	);

	useEffect(() => {
		if (!categoryIdsParam || !cartProductIdsParam) {
			return;
		}

		const controller = new AbortController();
		const params = new URLSearchParams({
			limit: "3",
			page: "1",
			sortBy: "createdAt",
			sortOrder: "desc",
			categoryIds: categoryIdsParam,
			excludeProductIds: cartProductIdsParam,
		});

		fetch(`http://localhost:5000/products?${params}`, { signal: controller.signal })
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to load recommendations (${res.status})`);
				}
				return res.json();
			})
			.then((data) => {
				setRecommendations(
					(data.products ?? []).map((product: Product) => ({
						...product,
						price: Number(product.price),
					})),
				);
				setError(null);
			})
			.catch((fetchError: unknown) => {
				if (controller.signal.aborted) return;
				console.error("Failed to load recommendations:", fetchError);
				setRecommendations([]);
				setError("Recommendations could not be loaded.");
			});

		return () => controller.abort();
	}, [categoryIdsParam, cartProductIdsParam]);
	const visibleRecommendations = categoryIdsParam && cartProductIdsParam ? recommendations : [];

	async function handleAdd(productId: string) {
		if (items.some((item) => item.productId === productId)) return;

		setAddingProductId(productId);
		setError(null);
		try {
			await onAdd(productId);
		} catch (addError: unknown) {
			console.error("Failed to add recommended product to cart:", addError);
			setError(addError instanceof Error ? addError.message : "Could not add product to cart.");
		} finally {
			setAddingProductId(null);
		}
	}

	return (
		<section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div>
				<h2 className="text-title-md font-bold text-on-surface">
					Frequently Added With These Items
				</h2>
				<p className="text-body-sm text-on-surface-variant">
					Complement your setup with zero additional delivery delay
				</p>
			</div>

			<div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
				{categoryIdsParam && error && (
					<p role="alert" className="col-span-full text-body-sm text-error">
						{error}
					</p>
				)}
				{visibleRecommendations.length == 0 && (
					<p role="alert" className="col-span-full text-body-sm text-on-surface-variant">
						No recommendations available.
					</p>
				)}
				{visibleRecommendations.map((recommendation) => (
					<article
						key={recommendation.id}
						className="flex flex-col justify-between gap-space-sm rounded-xl bg-surface-container-low p-space-md transition-shadow hover:shadow-md"
					>
						<div className="h-32 overflow-hidden rounded-lg bg-surface-container-lowest">
							{recommendation.productImages?.[0]?.url ? (
								<img
									src={recommendation.productImages[0].url}
									alt={recommendation.name}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
									<span className="material-symbols-outlined text-5xl text-primary/50">
										image
									</span>
								</div>
							)}
						</div>
						<h3 className="text-label-lg font-bold text-on-surface">
							{recommendation.name}
						</h3>
						<div className="flex items-center justify-between gap-space-sm">
							<span className="text-price-sm text-on-surface">
								{recommendation.price.toLocaleString("en-EG")} EGP
							</span>
							<button
								type="button"
								onClick={() => handleAdd(recommendation.id)}
								disabled={addingProductId !== null || items.some((item) => item.productId === recommendation.id)}
								className="rounded-lg bg-primary px-space-md py-space-sm text-label-md font-bold text-on-primary transition-colors hover:bg-primary-container"
							>
								{addingProductId === recommendation.id ? "Adding..." : "Add"}
							</button>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}

export default CartRecommendations;

import ProfileSidebar from "../../components/user/profile/ProfileSidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWishlist, removeFromWishlist } from "../../components/user/product/ProductHelper";

function WishlistPage({ wishlist }: { wishlist: string[]; toggleWishlist?: (productId: string) => void; }) {
	const queryClient = useQueryClient();
	
	const { data: wishlistProducts = [], isLoading, isError, error } = useQuery({
		queryKey: ["wishlist"],
		queryFn: fetchWishlist,
	});

	const removeMutation = useMutation({
		mutationFn: (productId: string) => removeFromWishlist(productId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["wishlist"] });
		},
	});

	const handleRemoveFromWishlist = (productId: string) => {
		removeMutation.mutate(productId);
	};

	const handleItemClick = (productId: string) => {
		window.location.href = `/products/${productId}`;
	};

	return (
		<main className="min-h-screen bg-surface">
			<div className="mx-auto max-w-7xl px-margin py-space-xl">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
					<aside className="lg:col-span-3">
						<ProfileSidebar wishlist={wishlist} />
					</aside>

					<section className="lg:col-span-9 flex flex-col gap-space-lg">
						{/* Header Card */}
						<div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
							<div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />

							<div className="flex flex-col items-start gap-space-lg md:flex-row md:items-center">
								
								<div className="flex flex-1 flex-col gap-space-xs">
									<h1 className="font-headline-lg text-headline-lg font-extrabold tracking-tight text-on-surface">
										My Wishlist
									</h1>
									<p className="max-w-3xl font-body-md text-body-md text-on-surface-variant">
										You have <strong className="font-bold text-on-surface">{wishlistProducts.length}</strong> {wishlistProducts.length === 1 ? "item" : "items"} saved in your wishlist
									</p>
								</div>
							</div>
						</div>

						{isError && (
							<div className="p-space-lg rounded-lg bg-error/10 border border-error">
								<p className="text-error font-semibold">
									Failed to load wishlist: {error instanceof Error ? error.message : "Unknown error"}
								</p>
							</div>
						)}

						{isLoading ? (
							<div className="text-center py-space-xl">
								<div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-space-md"></div>
								<p className="text-body-md text-on-surface-variant">Loading wishlist...</p>
							</div>
						) : wishlistProducts.length === 0 ? (
							<div className="rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
								<h2 className="text-headline-md font-bold text-on-surface mb-space-sm">
									Your wishlist is empty
								</h2>
								<p className="text-body-md text-on-surface-variant">
									Start adding products you love to your wishlist
								</p>
							</div>
						) : (
							<div className="flex flex-col gap-space-md">
								{wishlistProducts.map((product) => (
									<div
										key={product.id}
										className="rounded-xl bg-surface-container-lowest shadow-sm p-space-lg hover:shadow-md transition-shadow border border-outline-variant"
									>
										<div className="flex items-stretch gap-space-lg">
											{/* Product Image */}
											<div onClick={() => handleItemClick(product.id)} className="shrink-0 w-80 h-56 rounded-lg overflow-hidden bg-surface-container border border-outline-variant cursor-pointer">
												<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
													<span className="material-symbols-outlined text-8xl text-primary/50">
														image
													</span>
												</div>
											</div>

											{/* Product Details */}
											<div onClick={() => handleItemClick(product.id)} className="flex-1 min-w-0 flex flex-col cursor-pointer">
												<h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
													{product.name}
												</h3>
												<p className="text-body-sm text-on-surface-variant mb-space-md">
													Sold by <span className="font-semibold text-on-surface">{product.seller?.storeName || product.sellerId}</span>
												</p>

												{product.description && (
													<p className="text-body-sm text-on-surface-variant mb-space-md line-clamp-2">
														{product.description}
													</p>
												)}
											</div>

											{/* Price and Action */}
											<div className="shrink-0 flex flex-col items-end justify-between gap-space-md">
												<div className="text-headline-md font-bold text-on-surface">
													{parseFloat(product.price.toString()).toFixed(2)} EGP
												</div>
												<button
													onClick={() => handleRemoveFromWishlist(product.id)}
													disabled={removeMutation.isPending}
													className="flex items-center justify-center px-space-md py-space-sm rounded-full bg-error/10 hover:bg-error/20 text-error transition-colors disabled:opacity-50 gap-space-xs"
													title="Remove from wishlist"
												>
													<span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>
														favorite
													</span>
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</section>
				</div>
			</div>
		</main>
	);
}

export default WishlistPage;

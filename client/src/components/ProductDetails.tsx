import { useParams } from "react-router-dom";
import { products } from "../data/products";
import { useState } from "react";

type ProductDetailsProps = {
	wishlist: number[];
	toggleWishlist: (productId: number) => void;
};

function ProductDetails({ wishlist, toggleWishlist }: ProductDetailsProps) {
	const [quantity, setQuantity] = useState(1);

	const { id } = useParams();
	const product = products.find((p) => p.id === Number(id));
	if (!product) {
		return <p>Product not found</p>;
	}

	return (
		<main className="min-h-screen bg-surface px-margin py-space-xl">
			<div className="mx-auto max-w-7xl">
				{/* Breadcrumb */}
				<nav className="mb-space-xl text-body-sm text-on-surface-variant">
					<span>Home</span>
					<span className="mx-space-sm">/</span>
					<span>{product.category}</span>
					<span className="mx-space-sm">/</span>
					<span className="text-on-surface">{product.name}</span>
				</nav>

				{/* Main product section */}
				<div className="grid grid-cols-1 gap-space-xl lg:grid-cols-2">
					{/* Product image */}
					<div>
						<div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md">
							{product.badge && (
								<span className="absolute left-space-md top-space-md z-10 rounded-full bg-primary px-space-md py-space-sm text-label-md text-white">
									{product.badge}
								</span>
							)}

							<img
								src={product.image}
								alt={product.name}
								className="aspect-square w-full rounded-lg object-contain"
							/>
						</div>
					</div>

					{/* Product information */}
					<div className="flex flex-col gap-space-md">
						<p className="text-body-sm text-on-surface-variant">
							Sold by {product.seller}
						</p>

						<h1 className="text-headline-lg font-bold">{product.name}</h1>

						<p className="text-body-md text-on-surface-variant">
							★ {product.rating} / 5
						</p>

						<div className="flex flex-wrap items-center gap-space-md">
							<span className="text-2xl font-bold">
								EGP {product.price.toLocaleString()}
							</span>

							{product.oldPrice !== undefined && (
								<>
									<span className="text-body-md text-outline line-through">
										EGP {product.oldPrice.toLocaleString()}
									</span>

									<span className="rounded-md bg-error-container px-space-sm py-space-xs text-label-md text-on-error-container">
										{Math.round(
											((product.oldPrice - product.price) / product.oldPrice) *
												100,
										)}
										% OFF
									</span>
								</>
							)}
							<button
								type="button"
								aria-label={
									wishlist.includes(product.id)
										? "Remove from wishlist"
										: "Add to wishlist"
								}
								aria-pressed={wishlist.includes(product.id)}
								onClick={() => toggleWishlist(product.id)}
								className={`rounded-lg border border-outline-variant px-space-md py-space-md text-xl transition-colors ${
									wishlist.includes(product.id)
										? "text-error"
										: "text-on-surface hover:text-error"
								}`}
							>
								{wishlist.includes(product.id) ? "♥" : "♡"}
							</button>
						</div>

						<div className="my-space-sm border-t border-outline-variant" />

						<p className="text-body-md text-on-surface-variant">
							Available from {product.seller}. Explore the product details and
							choose your quantity before adding it to your cart.
						</p>

						<div className="flex flex-col gap-space-sm">
							<label className="text-label-md font-semibold">Quantity</label>

							<div className="flex w-fit items-center overflow-hidden rounded-lg border border-outline-variant">
								<button
									type="button"
									aria-label="Decrease quantity"
									disabled={quantity <= 1}
									onClick={() =>
										setQuantity((current) => Math.max(1, current - 1))
									}
									className="px-space-md py-space-sm text-lg disabled:opacity-40"
								>
									−
								</button>

								<span
									className="min-w-12 px-space-md py-space-sm text-center"
									aria-live="polite"
								>
									{quantity}
								</span>

								<button
									type="button"
									aria-label="Increase quantity"
									onClick={() => setQuantity((current) => current + 1)}
									className="px-space-md py-space-sm text-lg"
								>
									+
								</button>
							</div>
						</div>

						<button
							type="button"
							className="w-full rounded-lg bg-primary px-space-lg py-space-md font-semibold text-white transition-colors hover:bg-primary-container sm:w-fit"
						>
							Add to Cart
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}

export default ProductDetails;

import { useParams } from "react-router-dom";
import { products } from "../data/products";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

type ProductDetailsProps = {
	wishlist: number[];
	toggleWishlist: (productId: number) => void;
};

function ProductDetails({ wishlist, toggleWishlist }: ProductDetailsProps) {
	const { id } = useParams();
	const product = products.find((p) => p.id === Number(id));
	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(product?.image || "");

	useEffect(() => {
		if (product?.image) {
			setSelectedImage(product.image);
		}
	}, [product]);

	if (!product) {
		return <p>Product not found</p>;
	}

	const relatedProducts = products
		.filter(
			(item) => item.category === product?.category && item.id !== product?.id,
		)
		.slice(0, 4);

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
						<div className="space-y-space-md">
							{/* Main product image */}
							<div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md">
								{product.badge && (
									<span className="absolute left-space-md top-space-md z-10 rounded-full bg-primary px-space-md py-space-sm text-label-md text-white">
										{product.badge}
									</span>
								)}

								<img
									src={selectedImage}
									alt={product.name}
									className="aspect-square w-full rounded-lg object-contain"
								/>
							</div>

							{/* Image thumbnails */}
							<div className="flex gap-space-md">
								<button
									type="button"
									onClick={() => setSelectedImage(product.image)}
									aria-label={`View ${product.name}`}
									aria-pressed={selectedImage === product.image}
									className={`h-20 w-20 overflow-hidden rounded-lg border-2 p-space-xs ${
										selectedImage === product.image
											? "border-primary"
											: "border-outline-variant"
									}`}
								>
									<img
										src={product.image}
										alt=""
										className="h-full w-full object-contain"
									/>
								</button>
							</div>
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

						<div className="mt-space-md mb-space-xl space-y-space-md rounded-xl border border-outline-variant p-space-md">
							{/* Delivery information */}
							<div className="flex items-start gap-space-md">
								<span className="text-xl" aria-hidden="true">
									🚚
								</span>

								<div>
									<h3 className="text-title-md font-semibold">
										Delivery Information
									</h3>

									<p className="mt-space-xs text-body-sm text-on-surface-variant">
										Delivery options and estimated arrival will be confirmed at
										checkout.
									</p>
								</div>
							</div>

							<div className="border-t border-outline-variant" />

							{/* Returns information */}
							<div className="flex items-start gap-space-md">
								<span className="text-xl" aria-hidden="true">
									↩️
								</span>

								<div>
									<h3 className="text-title-md font-semibold">
										Returns & Refunds
									</h3>

									<p className="mt-space-xs text-body-sm text-on-surface-variant">
										Return eligibility and refund terms will be shown before you
										complete your order.
									</p>
								</div>
							</div>

							<div className="border-t border-outline-variant" />

							{/* Buyer protection */}
							<div className="flex items-start gap-space-md">
								<span className="text-xl" aria-hidden="true">
									🛡️
								</span>

								<div>
									<h3 className="text-title-md font-semibold">
										Buyer Protection
									</h3>

									<p className="mt-space-xs text-body-sm text-on-surface-variant">
										Shop with confidence through Sovereign's buyer protection
										experience.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Product description and specifications */}
			<section className="mt-space-6xl rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
				<h2 className="text-headline-md font-bold">Product Information</h2>

				{/* Description */}
				<div className="mt-space-lg">
					<h3 className="text-title-lg font-semibold">Description</h3>

					<p className="mt-space-sm leading-7 text-on-surface-variant">
						Discover the details of {product.name}, available from{" "}
						{product.seller}. Explore its features and choose the product that
						best suits your needs.
					</p>
				</div>

				{/* Specifications */}
				<div className="mt-space-xl">
					<h3 className="text-title-lg font-semibold">Specifications</h3>

					<dl className="mt-space-md divide-y divide-outline-variant">
						<div className="flex flex-col gap-space-xs py-space-md sm:flex-row sm:justify-between">
							<dt className="text-body-md text-on-surface-variant">Product</dt>
							<dd className="text-body-md font-medium">{product.name}</dd>
						</div>

						<div className="flex flex-col gap-space-xs py-space-md sm:flex-row sm:justify-between">
							<dt className="text-body-md text-on-surface-variant">Category</dt>
							<dd className="text-body-md font-medium">{product.category}</dd>
						</div>

						<div className="flex flex-col gap-space-xs py-space-md sm:flex-row sm:justify-between">
							<dt className="text-body-md text-on-surface-variant">Seller</dt>
							<dd className="text-body-md font-medium">{product.seller}</dd>
						</div>

						<div className="flex flex-col gap-space-xs py-space-md sm:flex-row sm:justify-between">
							<dt className="text-body-md text-on-surface-variant">Price</dt>
							<dd className="text-body-md font-medium">
								EGP {product.price.toLocaleString("en-EG")}
							</dd>
						</div>
					</dl>
				</div>
			</section>

			{/* Customer Reviews Section */}
			<section className="mt-12 border-t border-outline-variant/30 pt-8">
				<h2 className="text-2xl font-bold text-on-surface">Customer Reviews</h2>

				<div className="mt-6 grid gap-8 md:grid-cols-[220px_1fr]">
					<div>
						<p className="text-5xl font-bold text-on-surface">
							{product.rating.toFixed(1)}
							<span className="text-lg text-on-surface-variant">/5</span>
						</p>

						<div
							className="mt-2 text-lg text-amber-500"
							aria-label={`${product.rating} out of 5 stars`}
						>
							{"★".repeat(Math.round(product.rating))}
							{"☆".repeat(5 - Math.round(product.rating))}
						</div>

						<p className="mt-2 text-sm text-on-surface-variant">
							Based on the product's displayed rating
						</p>
					</div>

					<div className="space-y-5">
						<article className="border-b border-outline-variant/30 pb-5">
							<div className="flex items-center justify-between gap-4">
								<h3 className="font-semibold text-on-surface">
									Sample Customer
								</h3>

								<span className="text-sm text-on-surface-variant">
									Example review
								</span>
							</div>

							<div
								className="mt-2 text-amber-500"
								aria-label="5 out of 5 stars"
							>
								★★★★★
							</div>

							<p className="mt-3 text-sm leading-6 text-on-surface-variant">
								This is placeholder review content for the page design. Real
								customer reviews will be connected when we implement the
								backend.
							</p>
						</article>
					</div>
				</div>
			</section>

					{/* Related Products Section */}
			<section className="mt-12 border-t border-outline-variant/30 pt-8">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-on-surface">
							You May Also Like
						</h2>
						<p className="mt-2 text-sm text-on-surface-variant">
							Discover more products from this category.
						</p>
					</div>
				</div>

				{relatedProducts.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{relatedProducts.map((item) => (
							<ProductCard
								key={item.id}
								id={item.id}
								name={item.name}
								image={item.image}
								price={item.price}
								oldPrice={item.oldPrice}
								rating={item.rating}
								seller={item.seller}
								badge={item.badge}
								wishlist={wishlist}
								toggleWishlist={toggleWishlist}
							/>
						))}
					</div>
				) : (
					<p className="text-sm text-on-surface-variant">
						More products will appear here as the catalog grows.
					</p>
				)}
			</section>
		</main>
	);
}

export default ProductDetails;

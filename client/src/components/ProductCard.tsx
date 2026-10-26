import { Link } from "react-router-dom";

type ProductCardProps = {
	id: number;
	name: string;
	image: string;
	price: number;
	oldPrice?: number;
	rating?: number;
	seller: string;
	badge?: string;
	wishlist: number[];
	toggleWishlist: (productId: number) => void;
};

function ProductCard({
	id,
	name,
	image,
	price,
	oldPrice,
	rating,
	seller,
	badge,
	wishlist,
	toggleWishlist,
}: ProductCardProps) {
	return (
		<article className="group overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md">
			<div className="relative aspect-square overflow-hidden bg-surface-container-low">
				<Link to={`/products/${id}`} className="absolute inset-0 z-10">
					<img
						src={image}
						alt={name}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				</Link>

				{badge && (
					<span className="absolute left-space-sm top-space-sm rounded-full bg-primary px-space-sm py-1 text-label-sm font-bold text-on-primary">
						{badge}
					</span>
				)}

				<button
					type="button"
					aria-label={`Add ${name} to wishlist`}
					className="absolute right-space-sm top-space-sm flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm transition-colors hover:text-error"
					onClick={() => toggleWishlist(id)}
				>
					{wishlist.includes(id) ? "♥" : "♡"}
				</button>
			</div>

			<div className="p-space-md">
				<p className="mb-space-xs text-label-sm text-on-surface-variant">
					{seller}
				</p>

				<h3 className="mb-space-sm line-clamp-2 min-h-12 text-title-md font-semibold text-on-surface">
					<Link
						to={`/products/${id}`}
						className="transition-colors hover:text-primary"
					>
						{name}
					</Link>
				</h3>

				<p className="mb-space-sm text-label-md text-on-surface-variant">
					★ {rating ? rating.toFixed(1) : "N/A"}
				</p>

				<div className="flex flex-wrap items-baseline gap-space-sm">
					<span className="text-price-lg font-bold text-on-surface">
						EGP {price.toLocaleString("en-EG")}
					</span>

					{oldPrice !== undefined && (
						<span className="text-price-sm text-outline line-through">
							EGP {oldPrice.toLocaleString("en-EG")}
						</span>
					)}
				</div>
			</div>
		</article>
	);
}

export default ProductCard;

import type { CartItemView } from "../../types/cart";

type CartItemProps = {
	item: CartItemView;
	onQuantityChange: (id: string, quantity: number) => void;
	onRemove: (id: string) => void;
	wishlist: string[];
	toggleWishlist: (productId: string) => void;
};

function CartItem({
	item,
	onQuantityChange,
	onRemove,
	wishlist,
	toggleWishlist,
}: CartItemProps) {
	const { name, price } = item.product;
	const savings =
		item.originalPrice !== undefined ? item.originalPrice - price : 0;

	return (
		<article className="flex flex-col gap-space-lg p-space-lg md:flex-row">
			<div className="flex items-start gap-space-md">
				

				<div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
					<img
						src={item.image}
						alt={name}
						className="h-full w-full object-cover"
					/>
					<span
						className={`absolute left-1 top-1 rounded px-1.5 py-0.5 text-label-sm font-bold ${item.badgeClassName}`}
					>
						{item.badge}
					</span>
				</div>
			</div>

			<div className="flex flex-1 flex-col justify-between">
				<div className="flex flex-col justify-between gap-space-sm sm:flex-row sm:items-start">
					<div>
						<div className="mb-1 flex items-center gap-space-xs">
							<span className="text-label-sm font-bold uppercase tracking-wider text-primary">
								{item.category}
							</span>
						</div>

						<h2 className="text-title-md font-bold leading-snug text-on-surface">
							{name}
						</h2>

						<p className="mt-1 text-body-sm text-on-surface-variant">
							Authenticity verified • Local delivery available
						</p>
					</div>

					<div className="shrink-0 text-left sm:text-right">
						<div className="flex items-baseline gap-space-xs sm:justify-end">
							<span className="text-price-lg font-extrabold text-on-surface">
								{price.toLocaleString("en-EG")}
							</span>
							<span className="text-label-md font-bold text-on-surface">
								EGP
							</span>
						</div>

						{item.originalPrice !== undefined && (
							<div className="flex items-center gap-space-xs sm:justify-end">
								<span className="text-body-sm text-outline line-through">
									{item.originalPrice.toLocaleString("en-EG")} EGP
								</span>
								<span className="rounded bg-error/10 px-1.5 py-0.5 text-label-sm font-bold text-error">
									{Math.round((savings / item.originalPrice) * 100)}% OFF
								</span>
							</div>
						)}
					</div>
				</div>

				<div className="mt-space-md flex flex-wrap items-center justify-between gap-space-md pt-space-sm">
					<div className="flex items-center rounded-lg bg-surface-container-low p-0.5">
						<button
							type="button"
							aria-label={`Decrease quantity of ${name}`}
							disabled={item.quantity <= 1}
							onClick={() =>
								onQuantityChange(item.id, Math.max(1, item.quantity - 1))
							}
							className="flex h-8 w-8 items-center justify-center rounded text-lg text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
						>
							−
						</button>
						<span className="w-10 text-center text-label-lg font-bold text-on-surface">
							{item.quantity}
						</span>
						<button
							type="button"
							aria-label={`Increase quantity of ${name}`}
							onClick={() => onQuantityChange(item.id, item.quantity + 1)}
							className="flex h-8 w-8 items-center justify-center rounded text-lg text-on-surface transition-colors hover:bg-surface-container-high"
						>
							+
						</button>
					</div>

					<div className="flex items-center gap-space-md text-label-md">
						<button
							type="button"
							onClick={() => onRemove(item.id)}
							className="flex items-center gap-space-xs text-error transition-opacity hover:opacity-80"
						>
							<span aria-hidden="true">🗑</span>
							<span>Delete</span>
						</button>
						<button
							type="button"
							onClick={()=>{toggleWishlist(item.productId)}}
							className="flex items-center gap-space-xs text-on-surface-variant transition-colors hover:text-primary"
						>
							<span aria-hidden="true">{wishlist.includes(item.productId) ? "♥" : "♡"}</span>
							<span>Save for Later</span>
						</button>
					</div>
				</div>
			</div>
		</article>
	);
}

export default CartItem;

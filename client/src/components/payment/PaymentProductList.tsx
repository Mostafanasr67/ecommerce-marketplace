import type { CartItemView } from "../../types/cart";

type PaymentProductListProps = {
	items: CartItemView[];
};

function PaymentProductList({ items }: PaymentProductListProps) {
	return (
		<article className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
			{items.map((item, index) => (
				<div key={item.id}>
					<div className="flex flex-col gap-space-lg p-space-lg md:flex-row">
						<div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
							<img
								src={item.image}
								alt={item.product.name}
								className="h-full w-full object-cover"
							/>
							<span
								className={`absolute left-1 top-1 rounded px-1.5 py-0.5 text-label-sm font-bold ${item.badgeClassName}`}
							>
								{item.badge}
							</span>
						</div>

						<div className="flex flex-1 flex-col justify-between gap-space-sm sm:flex-row sm:items-start">
							<div>
								<span className="text-label-sm font-bold uppercase tracking-wider text-primary">
									{item.category}
								</span>
								<h2 className="text-title-md font-bold leading-snug text-on-surface">
									{item.product.name}
								</h2>
								<p className="mt-1 text-body-sm text-on-surface-variant">
									Qty: {item.quantity}
								</p>
							</div>

							<div className="shrink-0 text-left sm:text-right">
								<div className="flex items-baseline gap-space-xs sm:justify-end">
									<span className="text-price-lg font-extrabold text-on-surface">
										{item.product.price.toLocaleString("en-EG")}
									</span>
									<span className="text-label-md font-bold text-on-surface">
										EGP
									</span>
								</div>
								{item.originalPrice !== undefined && (
									<span className="text-body-sm text-outline line-through">
										{item.originalPrice.toLocaleString("en-EG")} EGP
									</span>
								)}
							</div>
						</div>
					</div>
					{index < items.length - 1 && (
						<div className="h-px w-full bg-surface-container" />
					)}
				</div>
			))}
		</article>
	);
}

export default PaymentProductList;

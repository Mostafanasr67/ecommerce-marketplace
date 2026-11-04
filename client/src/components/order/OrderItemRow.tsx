import OrderIcon from "./OrderIcon";
import type { IconName } from "./OrderIcon";
import { TONE_STYLES } from "./orderTone";
import type { Tone } from "./orderTone";

type OrderItemView = {
	image: string;
	sellerName: string;
	sellerIcon: IconName;
	name: string;
	details: string;
	highlightIcon?: IconName;
	highlight?: string;
	quantity: number;
	price: string;
	originalPrice?: string;
};

type OrderItemRowProps = {
	item: OrderItemView;
	tone: Tone;
};

function OrderItemRow({ item, tone }: OrderItemRowProps) {
	const styles = TONE_STYLES[tone];

	return (
		<div className="flex flex-col items-start justify-between gap-space-md py-space-sm sm:flex-row sm:items-center">
			<div className="flex min-w-0 items-center gap-space-md">
				<div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-container-low">
					<img src={item.image} alt={item.name} className="h-full w-full object-cover" />
				</div>
				<div className="flex min-w-0 flex-col">
					<div className="flex items-center gap-space-xs font-label-sm text-label-sm text-outline">
						<OrderIcon name={item.sellerIcon} className={`h-4 w-4 ${styles.text}`} />
						<span>{item.sellerName}</span>
					</div>
					<h3 className="truncate font-title-md text-title-md font-bold text-on-surface">{item.name}</h3>
					<p className="truncate font-body-sm text-body-sm text-on-surface-variant">{item.details}</p>
					<div className="mt-1 flex items-center gap-space-md">
						{item.highlight && item.highlightIcon && (
							<span className={`flex items-center gap-1 font-label-md text-label-md font-semibold ${styles.text}`}>
								<OrderIcon name={item.highlightIcon} className="h-4 w-4" />
								{item.highlight}
							</span>
						)}
						<span className="font-label-md text-label-md text-on-surface-variant">Qty: {item.quantity}</span>
					</div>
				</div>
			</div>

			<div className="flex w-full items-center justify-between gap-space-sm text-right sm:w-auto sm:shrink-0 sm:flex-col sm:items-end sm:justify-between">
				<span className="font-price-sm text-price-sm font-extrabold text-on-surface">{item.price} EGP</span>
				{item.originalPrice && (
					<span className="font-label-sm text-label-sm text-outline line-through">{item.originalPrice} EGP</span>
				)}
			</div>
		</div>
	);
}

export type { OrderItemView };
export default OrderItemRow;

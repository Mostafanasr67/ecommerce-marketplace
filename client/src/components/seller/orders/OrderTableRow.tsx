import type { SellerOrder } from "../../../types/seller";
import OrderStatusSelector from "./OrderStatusSelector";

interface OrderTableRowProps {
	order: SellerOrder;
	isActive?: boolean;
	onViewClick: (orderId: string) => void;
	onStatusChange: (orderId: string, status: SellerOrder["status"]) => void;
	updatingStatus: boolean;
}

function OrderTableRow({ order, isActive = false, onViewClick, onStatusChange, updatingStatus }: OrderTableRowProps) {
	const customerName = order.order.fullname || "Unknown Customer";
	const customerLocation = order.order.area
		? `${order.order.area}${order.order.city ? `, ${order.order.city}` : ""}`
		: "Location not specified";
	const itemCount = order.orderItems.length || 0;
	const detailsId = `order-items-${order.id}`;
	const image = order.orderItems
		.flatMap((item) => item.product.productImages)
		.find((productImage) => productImage.url.trim());

	const formatCurrency = (amount: string | number) => {
		return Number(amount).toLocaleString("en-EG", {
			maximumFractionDigits: 2,
		});
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-EG", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<article className="flex flex-col gap-space-md rounded-xl border border-surface-container bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
			<div className="flex flex-col gap-space-md sm:flex-row sm:items-center">
				<button
					type="button"
					aria-expanded={isActive}
					aria-controls={detailsId}
					onClick={() => onViewClick(order.id)}
					className="flex min-w-0 flex-1 cursor-pointer items-center gap-space-md text-left"
				>
					{image ? (
						<img
							src={image.url}
							alt={image.altText || order.orderItems[0]?.product.name || "Order item"}
							className="h-20 w-20 shrink-0 rounded-lg bg-surface-container object-cover"
						/>
					) : (
						<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-outline">
							<span className="material-symbols-outlined" aria-hidden="true">receipt_long</span>
						</div>
					)}
					<div className="min-w-0 flex-1">
						<h3 className="break-all font-title-md text-title-md font-semibold text-on-surface">{order.orderId}</h3>
						<p className="mt-1 truncate font-body-sm text-on-surface-variant">{customerName} · {customerLocation}</p>
						<p className="mt-2 font-label-sm text-on-surface-variant">{formatDate(order.createdAt)} · {itemCount} item{itemCount !== 1 ? "s" : ""}</p>
					</div>
				</button>
				<div className="flex flex-wrap items-center justify-between gap-space-md sm:w-72 sm:shrink-0 sm:justify-end">
					<div>
						<p className="font-label-sm text-on-surface-variant">Seller total</p>
						<p className="mt-1 font-label-lg font-semibold text-on-surface">{formatCurrency(order.subTotal)} EGP</p>
					</div>
					<OrderStatusSelector order={order} updating={updatingStatus} onChange={onStatusChange} />
				</div>
			</div>
			{isActive && (
				<div id={detailsId} className="border-t border-surface-container pt-space-md">
					<p className="font-label-lg font-semibold text-on-surface">Order items</p>
					{order.orderItems.length > 0 ? (
						<ul className="mt-space-sm divide-y divide-surface-container">
							{order.orderItems.map((item) => (
								<li key={item.id} className="flex flex-wrap justify-between gap-space-md py-3 font-body-sm text-on-surface">
									<span className="font-medium">{item.product.name}</span>
									<span className="flex gap-space-md text-on-surface-variant">
										<span>Quantity: {item.quantity}</span>
										<span>Unit price: {formatCurrency(item.unitPrice)} EGP</span>
									</span>
								</li>
							))}
						</ul>
					) : (
						<p className="mt-space-sm font-body-sm text-on-surface-variant">No items in this order.</p>
					)}
				</div>
			)}
		</article>
	);
}

export default OrderTableRow;

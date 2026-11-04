import { useState } from "react";
import type { Order } from "../../types/order";

interface OrderCardProps {
	order: Order;
}

function OrderCard({ order }: OrderCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const itemCount = order.sellerOrders?.reduce((count, sellerOrder) => {
		return count + (sellerOrder.orderItems?.reduce((itemCount, orderItem) => itemCount + orderItem.quantity, 0) ?? 0);
	}, 0) ?? 0;

	const getStatusColor = (status: string): string => {
		switch (status) {
			case "Delivered":
				return "text-primary bg-primary-container";
			case "Shipped":
				return "text-secondary bg-secondary-container";
			case "Processing":
				return "text-tertiary bg-tertiary-container";
			case "Pending":
				return "text-outline";
			case "Cancelled":
				return "text-error";
			default:
				return "text-on-surface-variant";
		}
	};

	const getStatusIcon = (status: string): string => {
		switch (status) {
			case "Delivered":
				return "check_circle";
			case "Shipped":
				return "local_shipping";
			case "Processing":
				return "schedule";
			case "Pending":
				return "schedule";
			case "Cancelled":
				return "cancel";
			default:
				return "info";
		}
	};

	return (
		<div className="rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all duration-300">
			<div className="p-space-lg">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-space-xs flex-1">
						<div className="flex items-center gap-space-sm">
							<span className="font-label-lg text-label-lg font-semibold text-on-surface">
								Order #{order.id}
							</span>
							<span className={`flex items-center gap-space-xs font-label-sm text-label-sm font-semibold px-space-sm py-1 rounded-full ${getStatusColor(order.status)}`}>
								<span className="material-symbols-outlined text-base">{getStatusIcon(order.status)}</span>
								{order.status}
							</span>
						</div>
						<span className="font-body-sm text-body-sm text-on-surface-variant">
							Ordered on {new Date(order.createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								day: "numeric",
								month: "numeric",				
							})}
						</span>
					</div>
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="ml-space-lg flex items-center gap-space-xs px-space-lg py-space-sm rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-on-primary transition-all duration-300"
					>
						<span className="font-label-lg text-label-lg font-semibold">{isExpanded ? "Less details" : "More details"}</span>
						<span className="material-symbols-outlined text-xl">{isExpanded ? "arrow_upward" : "arrow_downward"}</span>
					</button>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-3 gap-space-md mt-space-md border-t border-surface-container pt-space-md">
					<div className="flex flex-col gap-space-xs">
						<span className="font-label-sm text-label-sm text-on-surface-variant">Items</span>
						<span className="font-headline-sm text-headline-sm font-bold text-on-surface">
							{itemCount}
						</span>
					</div>
					<div className="flex flex-col gap-space-xs">
						<span className="font-label-sm text-label-sm text-on-surface-variant">Total Amount</span>
						<span className="font-price-sm text-price-sm font-extrabold text-primary">
							{(typeof order.totalAmount === 'number' ? order.totalAmount : parseFloat(order.totalAmount.toString())).toLocaleString("en-EG")} EGP
						</span>
					</div>
					<div className="flex flex-col gap-space-xs">
						<span className="font-label-sm text-label-sm text-on-surface-variant">Shipped To</span>
						<div className="flex flex-col gap-space-xs">
							<span className="font-body-sm text-body-sm text-on-surface">{order.building}, {order.street}, {order.area}, {order.city}</span>

						</div>
					</div>
				</div>
			</div>

			{/* Expanded Items Section */}
			{isExpanded && (
				<div className="border-t border-surface-container bg-surface-container-low/50 p-space-lg">
					<div className="flex flex-col gap-space-md">
						<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
							Order Items
						</h3>
						
						{order.sellerOrders?.map((sellerOrder, sellerIndex) => (
							<div key={sellerOrder.id} className="rounded-lg bg-surface-container-lowest p-space-md border border-surface-container">
								{/* Seller Header */}
								<div className="flex items-center gap-space-sm mb-space-md pb-space-sm border-b border-surface-container">
									<span className="material-symbols-outlined text-lg text-primary">store</span>
									<div className="flex-1">
										<span className="font-label-lg text-label-lg font-semibold text-on-surface">
											Seller {sellerIndex + 1}
										</span>
									</div>
									<span className="font-label-sm text-label-sm text-on-surface-variant">
										Subtotal: <span className="font-bold text-primary">{typeof sellerOrder.subTotal === 'number' ? sellerOrder.subTotal.toLocaleString("en-EG") : sellerOrder.subTotal} EGP</span>
									</span>
								</div>

								{/* Items */}
								<div className="flex flex-col gap-space-sm">
									{sellerOrder.orderItems?.map((item) => (
										<div key={item.id} className="flex gap-space-md p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
											{/* Product Image */}
											<div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
												{item.product?.productImages?.[0]?.url ? (
													<img
														src={item.product.productImages[0].url}
														alt={item.product.name}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<span className="material-symbols-outlined text-outline">image</span>
													</div>
												)}
											</div>

											{/* Product Details */}
											<div className="flex-1 flex flex-col justify-between">
												<div>
													<span className="font-label-lg text-label-lg font-semibold text-on-surface block">
														{item.product?.name ?? `Product ${item.productId}`}
													</span>
													<span className="font-body-sm text-body-sm text-on-surface-variant">
														ID: {item.productId}
													</span>
												</div>
											</div>

											{/* Quantity and Price */}
											<div className="flex flex-col items-end justify-between text-right">
												<div className="flex items-center gap-space-xs">
													<span className="font-label-sm text-label-sm text-on-surface-variant">Qty:</span>
													<span className="font-label-lg text-label-lg font-bold text-on-surface">
														{item.quantity}
													</span>
												</div>
												<span className="font-price-sm text-price-sm font-extrabold text-primary">
													{typeof item.unitPrice === 'number' ? item.unitPrice.toLocaleString("en-EG") : item.unitPrice} EGP
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default OrderCard;

interface OrdersHeaderProps {
	totalOrders: number;
}

function OrdersHeader({ totalOrders }: OrdersHeaderProps) {
	return (
		<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex flex-col gap-space-sm">
				<h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
					My Orders
				</h2>
				<p className="font-body-md text-body-md text-on-surface-variant">
					Track and manage your purchases
				</p>
				<div className="flex items-center gap-space-xs pt-space-sm">
					<span className="material-symbols-outlined text-lg text-primary">shopping_bag</span>
					<span className="font-label-lg text-label-lg font-semibold text-primary">
						{totalOrders} {totalOrders === 1 ? "order" : "orders"}
					</span>
				</div>
			</div>
		</div>
	);
}

export default OrdersHeader;

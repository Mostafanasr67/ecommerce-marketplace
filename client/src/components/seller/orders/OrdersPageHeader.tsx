interface OrdersPageHeaderProps {
	totalOrders: number;
}

function OrdersPageHeader({
	totalOrders,
}: OrdersPageHeaderProps) {
	return (
		<div className="pb-space-lg border-b border-surface-container-low">
			<h1 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">
				Store Purchase Ledger
			</h1>
			<p className="font-body-md text-on-surface-variant mb-space-md">
				Manage and track all customer orders, payments, and fulfillment status
			</p>
			<div className="flex items-center gap-space-md flex-wrap">
				<div>
					<span className="mt-space-md font-label-md text-on-surface-variant">
						{totalOrders} Orders
					</span>
				</div>
				
			</div>
		</div>
	);
}

export default OrdersPageHeader;

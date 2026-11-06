interface OrdersFilterProps {
	selectedStatus: string;
	onStatusChange: (status: string) => void;
}

function OrdersFilter({ selectedStatus, onStatusChange }: OrdersFilterProps) {
	const statusOptions = [
		{ id: "ALL", label: "All Orders", icon: "shopping_bag" },
		{ id: "PENDING", label: "Pending", icon: "schedule" },
		{ id: "PROCESSING", label: "Processing", icon: "schedule" },
		{ id: "SHIPPED", label: "Shipped", icon: "local_shipping" },
		{ id: "DELIVERED", label: "Delivered", icon: "check_circle" },
		{ id: "CANCELLED", label: "Cancelled", icon: "cancel" },
	];

	return (
		<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex flex-col gap-space-md">
				<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
					Filter by Status
				</h3>
				<div className="flex flex-wrap gap-space-sm">
					{statusOptions.map((option) => (
						<button
							key={option.id}
							onClick={() => onStatusChange(option.id)}
							className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg transition-colors whitespace-nowrap ${
								selectedStatus === option.id
									? "bg-primary text-on-primary"
									: "text-on-surface hover:bg-surface-container-low"
							}`}
						>
							<span className="material-symbols-outlined text-lg">{option.icon}</span>
							<span className="font-label-lg text-label-lg font-semibold">{option.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

export default OrdersFilter;

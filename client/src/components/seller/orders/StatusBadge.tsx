import type { SellerOrder } from "../../../types/seller";

interface StatusBadgeProps {
	status: SellerOrder["status"];
	isActive?: boolean;
}

function StatusBadge({ status, isActive = false }: StatusBadgeProps) {
const statusConfig = {
		PENDING: {
			bg: "bg-secondary-fixed",
			text: "text-on-secondary-fixed",
			label: "Pending",
		},
		CONFIRMED: {
			bg: "bg-secondary-container",
			text: "text-on-secondary-fixed",
			label: "Confirmed",
		},
		PROCESSING: {
			bg: "bg-tertiary-fixed",
			text: "text-on-tertiary-fixed",
			label: "Processing",
		},
		SHIPPED: {
			bg: "bg-secondary-container",
			text: "text-on-secondary-container",
			label: "Shipped",
		},
		DELIVERED: {
			bg: "bg-primary-container",
			text: "text-on-primary-container",
			label: "Delivered",
		},
		CANCELLED: {
			bg: "bg-error-container",
			text: "text-on-error-container",
			label: "Cancelled",
		},
	};

	const config = statusConfig[status];

	if (isActive) {
		return (
			<button className={`px-3 py-1.5 rounded-xl ${config.bg} ${config.text} font-label-sm text-label-sm font-semibold hover:opacity-90 transition-opacity shadow-sm`}>
				Active
			</button>
		);
	}

	return (
		<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${config.bg} ${config.text} font-label-sm text-label-sm`}>
			{config.label}
		</span>
	);
}

export default StatusBadge;

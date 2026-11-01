import { Link } from "react-router-dom";
import OrderIcon from "./OrderIcon";

function OrderActions() {
	return (
		<div className="flex flex-wrap items-center justify-between gap-space-md">
			<div className="flex flex-wrap items-center gap-space-sm">
				<button
					type="button"
					className="flex h-11 items-center gap-space-xs rounded-lg bg-primary px-space-lg font-label-lg text-label-lg font-bold text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-95"
				>
					<OrderIcon name="download" className="h-5 w-5" />
					<span>Download Tax Invoice (PDF)</span>
				</button>
				<a
					href="#dispatch-timeline"
					className="flex h-11 items-center gap-space-xs rounded-lg bg-surface-container-high px-space-lg font-label-lg text-label-lg font-semibold text-on-surface transition-colors hover:bg-surface-variant"
				>
					<OrderIcon name="truck" className="h-5 w-5 text-primary" />
					<span>Track Live Shipment</span>
				</a>
			</div>
			<Link
				to="/"
				className="flex h-11 items-center gap-space-xs px-space-md font-label-lg text-label-lg font-semibold text-on-surface-variant transition-colors hover:text-primary"
			>
				<span>Continue Shopping</span>
				<OrderIcon name="arrowRight" className="h-5 w-5" />
			</Link>
		</div>
	);
}

export default OrderActions;

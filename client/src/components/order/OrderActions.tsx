import { Link } from "react-router-dom";
import OrderIcon from "./OrderIcon";

function OrderActions() {
	return (
		<div className="flex flex-wrap items-center justify-end gap-space-md">
			<Link
				to="/home"
				className="flex h-11 items-center gap-space-xs px-space-md font-label-lg text-label-lg font-semibold text-on-surface-variant transition-colors hover:text-primary"
			>
				<span>Continue Shopping</span>
				<OrderIcon name="arrowRight" className="h-5 w-5" />
			</Link>
		</div>
	);
}

export default OrderActions;

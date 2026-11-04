import type { Order } from "./OrderHelper";
import OrderIcon from "./OrderIcon";

function OrderConfirmationHeader({order}: {order: Order}) {
	return (
		<section className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
			<div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />
			

			<div className="flex flex-col items-start gap-space-lg md:flex-row md:items-center">
				<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/25">
					<OrderIcon name="verified" className="h-10 w-10" />
				</div>
				<div className="flex flex-1 flex-col gap-space-xs">
					<div className="mb-2 flex flex-wrap items-center gap-space-sm">
						<h1 className="font-headline-lg text-headline-lg font-extrabold tracking-tight text-on-surface">
							Thank You, {order.fullname}! Your Order Has Been Placed.
						</h1>
						
					</div>
					<p className="max-w-3xl font-body-md text-body-md text-on-surface-variant">
						Order <strong className="font-bold text-on-surface">#{order.id}</strong> is authorized. A digital receipt and SMS tracking PIN have been dispatched to{" "}
						<span className="font-semibold text-on-surface">{order.phone}</span>
					</p>
				</div>
			</div>
		</section>
	);
}

export default OrderConfirmationHeader;

import { useRef } from "react";
import type { SellerOrder } from "../../../types/seller";
import StatusBadge from "./StatusBadge";

const statuses: SellerOrder["status"][] = [
	"PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED",
];

const statusLabels: Record<SellerOrder["status"], string> = {
	PENDING: "Pending",
	CONFIRMED: "Confirmed",
	PROCESSING: "Processing",
	SHIPPED: "Shipped",
	DELIVERED: "Delivered",
	CANCELLED: "Cancelled",
};

interface OrderStatusSelectorProps {
	order: SellerOrder;
	updating: boolean;
	onChange: (orderId: string, status: SellerOrder["status"]) => void;
}

function OrderStatusSelector({ order, updating, onChange }: OrderStatusSelectorProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	return (
		<div onClick={(event) => event.stopPropagation()}>
			<button
				type="button"
				disabled={updating}
				onClick={() => dialogRef.current?.showModal()}
				aria-label={`Change status for order ${order.orderId}, currently ${order.status.toLowerCase()}`}
				className="inline-flex cursor-pointer items-center gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
			>
				<StatusBadge status={order.status} />
				<span className="material-symbols-outlined text-lg text-on-surface-variant" aria-hidden="true">
					{updating ? "hourglass_top" : "expand_more"}
				</span>
			</button>
			<dialog ref={dialogRef} aria-labelledby={`status-title-${order.id}`} className="m-auto w-[min(90vw,24rem)] rounded-2xl bg-surface-container-lowest p-space-lg text-left text-on-surface shadow-xl backdrop:bg-black/40">
				<div className="flex items-start justify-between gap-space-md">
					<div>
						<h2 id={`status-title-${order.id}`} className="font-title-md font-bold">Update order status</h2>
						<p className="mt-1 break-all font-body-sm text-on-surface-variant">Order {order.orderId}</p>
					</div>
					<button type="button" aria-label="Close status options" onClick={() => dialogRef.current?.close()} className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container">
						<span className="material-symbols-outlined" aria-hidden="true">close</span>
					</button>
				</div>
				<p className="mt-space-md font-body-sm text-on-surface-variant">
					Cancelling restores stock. Reopening reserves it again; payment and refunds are not changed.
				</p>
				<div className="mt-space-md flex flex-col divide-y divide-surface-container border-y border-surface-container">
					{statuses.filter((status) => status !== order.status).map((status) => (
						<button
							key={status}
							type="button"
							onClick={() => {
								dialogRef.current?.close();
								onChange(order.id, status);
							}}
							className="flex w-full cursor-pointer items-center justify-between px-space-sm py-3 text-left font-label-lg text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-surface"
						>
							<span>{statusLabels[status]}</span>
							<span className="material-symbols-outlined text-lg text-on-surface-variant" aria-hidden="true">chevron_right</span>
						</button>
					))}
				</div>
			</dialog>
		</div>
	);
}

export default OrderStatusSelector;

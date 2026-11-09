import type { SellerOrder } from "../../../types/seller";
import OrderTableRow from "./OrderTableRow";

interface OrdersTableProps {
	orders: SellerOrder[];
	activeOrderId?: string;
	onViewOrder: (orderId: string) => void;
	onStatusChange: (orderId: string, status: SellerOrder["status"]) => void;
	updatingOrderIds: string[];
}

function OrdersTable({
	orders,
	activeOrderId,
	onViewOrder,
	onStatusChange,
	updatingOrderIds,
}: OrdersTableProps) {
	if (orders.length === 0) {
		return (
			<div className="rounded-xl border border-surface-container bg-surface-container-lowest p-space-lg text-center text-on-surface-variant shadow-sm">
				<p className="font-body-md">No orders to display</p>
			</div>
		);
	}

	return (
		<section aria-label="Seller orders" className="flex flex-col gap-space-md">
			
			<div className="flex flex-col gap-space-md">
				{orders.map((order) => (
					<OrderTableRow
						key={order.id}
						order={order}
						isActive={activeOrderId === order.id}
						onViewClick={onViewOrder}
						onStatusChange={onStatusChange}
						updatingStatus={updatingOrderIds.includes(order.id)}
					/>
				))}
			</div>
		</section>
	);
}

export default OrdersTable;

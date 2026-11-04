import OrderCard from "./OrderCard";
import type { Order } from "../../types/order";


interface OrdersListProps {
	orders: Order[];
}

function OrdersList({ orders }: OrdersListProps) {
	if (orders.length === 0) {
		return (
			<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col items-center justify-center gap-space-md py-space-xl">
				<span className="material-symbols-outlined text-5xl text-outline">shopping_bag</span>
				<div className="flex flex-col items-center gap-space-xs">
					<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
						No Orders Yet
					</h3>
					<p className="font-body-sm text-body-sm text-on-surface-variant">
						Start shopping to see your orders here
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-space-lg">
			{orders.map((order) => (
				<OrderCard key={order.id} order={order} />
			))}
		</div>
	);
}

export default OrdersList;

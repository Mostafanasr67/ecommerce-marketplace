import type { SellerOrder } from "../../../types/seller";

function RecentOrdersTable({ orders }: { orders: SellerOrder[] }) {
	const recentOrders = [...orders].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5);
	return (
		<section id="recent-orders" className="flex flex-col rounded-xl bg-surface-container-lowest p-space-lg shadow-sm xl:col-span-7">
			<div className="pb-space-md">
				<h2 className="font-headline-sm text-on-surface">Recent Orders</h2>
				<p className="font-label-sm text-secondary">Your five most recent orders</p>
			</div>
			{recentOrders.length === 0 ? <p className="text-secondary">No orders yet.</p> : (
				<div className="-mx-space-lg overflow-x-auto px-space-lg">
					<table className="w-full border-collapse text-left">
						<thead>
							<tr className="bg-surface-container-low font-label-sm uppercase tracking-wider text-secondary">
								<th className="rounded-l-xl px-space-sm py-3">Order &amp; Date</th>
								<th className="px-space-sm py-3">Customer</th>
								<th className="px-space-sm py-3">Purchased Items</th>
								<th className="px-space-sm py-3 text-right">Total</th>
								<th className="rounded-r-xl px-space-sm py-3 text-center">Status</th>
							</tr>
						</thead>
						<tbody className="font-body-sm text-on-surface">
							{recentOrders.map((order, index) => (
								<tr key={order.id} className={`transition-colors hover:bg-surface-container-low/60 ${index % 2 === 1 ? "bg-surface-container-low/20" : ""}`}>
									<td className="px-space-sm py-3.5">
										<div className="font-label-md font-semibold">{order.orderId}</div>
										<div className="font-label-sm text-secondary">{new Date(order.createdAt).toLocaleString()}</div>
									</td>
									<td className="px-space-sm py-3.5">
										<div className="font-semibold">{order.order.fullname}</div>
										<div className="font-label-sm text-outline">{order.order.area}, {order.order.city}</div>
									</td>
									<td className="px-space-sm py-3.5">
										{order.orderItems.map((item) => <div key={item.id}>{item.product.name} × {item.quantity}</div>)}
									</td>
									<td className="whitespace-nowrap px-space-sm py-3.5 text-right">
										<span className="font-price-sm">{Number(order.subTotal).toLocaleString("en-EG", { maximumFractionDigits: 2 })}</span>{" "}
										<span className="font-label-sm text-secondary">EGP</span>
									</td>
									<td className="whitespace-nowrap px-space-sm py-3.5 text-center">
										<span className="inline-flex rounded-full bg-secondary-container px-2.5 py-0.5 font-label-sm font-semibold text-on-secondary-fixed">{order.status}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}

export default RecentOrdersTable;

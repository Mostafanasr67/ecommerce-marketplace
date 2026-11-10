import type { AdminOrder } from "../../types/admin";
import { AdminModal } from "./AdminUI";

function AdminOrderDetails({ order, onClose }: { order: AdminOrder; onClose: () => void }) {
	const items = order.sellerOrders.flatMap((sellerOrder) =>
		sellerOrder.orderItems.map((item) => ({ ...item, sellerName: sellerOrder.seller.storeName, sellerOrderStatus: sellerOrder.status })),
	);
	return (
		<AdminModal title={`Order ${order.id}`} onClose={onClose} wide>
			<div className="grid gap-space-md sm:grid-cols-2">
				<section className="rounded-xl bg-surface-container-low p-space-md">
					<h3 className="font-label-lg font-semibold">Customer</h3>
					<p className="mt-2 font-body-sm">{order.fullname}</p>
					<p className="font-body-sm text-on-surface-variant">{order.user.email}</p>
					<p className="font-body-sm text-on-surface-variant">{order.phone}</p>
					<p className="mt-2 font-body-sm text-on-surface-variant">{order.street}, {order.area}, {order.city}, {order.country}</p>
					<p className="font-body-sm text-on-surface-variant">Building {order.building}, Apartment {order.apartment}</p>
				</section>
				<section className="rounded-xl bg-surface-container-low p-space-md">
					<h3 className="font-label-lg font-semibold">Payment &amp; status</h3>
					<p className="mt-2 font-body-sm">Order: {order.status}</p>
					<p className="font-body-sm">Payment: {order.payment?.status ?? "Unavailable"} · {order.payment?.method ?? "Unavailable"}</p>
					<p className="mt-2 font-label-lg font-semibold">{Number(order.totalAmount).toLocaleString("en-EG", { maximumFractionDigits: 2 })} EGP</p>
					<p className="font-label-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleString()}</p>
				</section>
			</div>
			<section className="mt-space-md">
				<h3 className="font-label-lg font-semibold">Order items ({items.length})</h3>
				<div className="mt-space-sm divide-y divide-surface-container rounded-xl border border-surface-container">
					{items.map((item) => (
						<div key={item.id} className="flex items-center gap-space-sm p-space-sm">
							{item.product.productImages[0]?.url
								? <img src={item.product.productImages[0].url} alt={item.product.name} className="h-12 w-12 rounded-lg object-cover" />
								: <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-low"><span className="material-symbols-outlined">inventory_2</span></div>}
							<div className="min-w-0 flex-1">
								<p className="truncate font-label-md font-semibold">{item.product.name}</p>
								<p className="font-label-sm text-on-surface-variant">{item.sellerName} · Qty {item.quantity} · {item.sellerOrderStatus}</p>
							</div>
							<p className="whitespace-nowrap font-label-md">{Number(item.unitPrice).toLocaleString("en-EG")} EGP</p>
						</div>
					))}
				</div>
			</section>
		</AdminModal>
	);
}

export default AdminOrderDetails;

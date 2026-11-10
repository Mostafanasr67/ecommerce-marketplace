import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { AdminOrder } from "../../types/admin";
import AdminOrderDetails from "../../components/admin/AdminOrderDetails";
import { AdminButton, AdminError, AdminLoading, AdminPageHeader, AdminStatus, AdminTable, AdminTableHeader } from "../../components/admin/AdminUI";
import { fetchAdminOverview } from "./AdminHelper";

function AdminOverviewPage() {
	const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
	const query = useQuery({ queryKey: ["admin", "overview"], queryFn: fetchAdminOverview });
	const data = query.data;
	const stats = data ? [
		{ label: "Total Sales", value: `${Number(data.stats.totalSales).toLocaleString("en-EG", { maximumFractionDigits: 2 })} EGP`, icon: "payments" },
		{ label: "Total Orders", value: data.stats.totalOrders.toLocaleString("en-EG"), icon: "shopping_bag" },
		{ label: "Total Users", value: data.stats.totalUsers.toLocaleString("en-EG"), icon: "group" },
		{ label: "Total Products", value: data.stats.totalProducts.toLocaleString("en-EG"), icon: "inventory_2" },
	] : [];

	return (
		<>
			<AdminPageHeader title="Marketplace Overview" description="A snapshot of activity across Sovereign." />
			{query.isPending && <AdminLoading />}
			{query.isError && <AdminError message={`Failed to load overview: ${query.error.message}`} />}
			{data && (
				<>
					<section aria-label="Marketplace statistics" className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4">
						{stats.map((metric) => (
							<article key={metric.label} className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
								<div>
									<p className="font-label-lg font-semibold text-on-surface-variant">{metric.label}</p>
									<p className="mt-1 font-title-lg font-bold text-on-surface">{metric.value}</p>
								</div>
								<span className="material-symbols-outlined text-3xl text-primary" aria-hidden="true">{metric.icon}</span>
							</article>
						))}
					</section>
					<div className="mt-space-lg grid grid-cols-1 gap-space-lg xl:grid-cols-12">
						<section className="xl:col-span-8">
							<div className="mb-space-sm flex flex-wrap items-end justify-between gap-space-sm">
								<div>
									<h2 className="font-headline-sm font-semibold">Recent Orders</h2>
									<p className="font-label-sm text-on-surface-variant">The latest five marketplace orders</p>
								</div>
								<Link to="/admin-orders" className="font-label-md font-semibold text-primary hover:underline">View all orders</Link>
							</div>
							<AdminTable empty={data.recentOrders.length === 0}>
								<AdminTableHeader columns={["Order ID", "Customer", "Date", "Total", "Payment", "Status", ""]} />
								<tbody className="font-body-sm">
									{data.recentOrders.map((order) => (
										<tr key={order.id} className="border-t border-surface-container hover:bg-surface-container-low/50">
											<td className="px-space-md py-3 font-label-sm">{order.id.slice(0, 8)}…</td>
											<td className="px-space-md py-3">{order.fullname}</td>
											<td className="whitespace-nowrap px-space-md py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
											<td className="whitespace-nowrap px-space-md py-3">{Number(order.totalAmount).toLocaleString("en-EG")} EGP</td>
											<td className="px-space-md py-3">{order.payment?.status ?? "—"}</td>
											<td className="px-space-md py-3"><AdminStatus>{order.status}</AdminStatus></td>
											<td className="px-space-md py-3"><AdminButton type="button" onClick={() => setSelectedOrder(order)}>View details</AdminButton></td>
										</tr>
									))}
								</tbody>
							</AdminTable>
						</section>
						<section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm xl:col-span-4">
							<h2 className="font-headline-sm font-semibold">Recent Marketplace Activity</h2>
							<p className="mb-space-md font-label-sm text-on-surface-variant">Registrations, listings, and orders</p>
							{data.activity.length === 0 ? <p className="font-body-sm text-on-surface-variant">No recent activity.</p> : (
								<ul className="divide-y divide-surface-container">
									{data.activity.map((activity) => (
										<li key={`${activity.kind}-${activity.id}`} className="flex gap-space-sm py-space-sm">
											<span className="material-symbols-outlined text-primary" aria-hidden="true">{activity.kind === "user" ? "person_add" : activity.kind === "seller" ? "storefront" : activity.kind === "product" ? "inventory_2" : "receipt_long"}</span>
											<div className="min-w-0">
												<p className="font-body-sm">{activity.label}</p>
												<p className="font-label-sm text-on-surface-variant">{new Date(activity.createdAt).toLocaleString()}</p>
											</div>
										</li>
									))}
								</ul>
							)}
						</section>
					</div>
				</>
			)}
			{selectedOrder && <AdminOrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
		</>
	);
}

export default AdminOverviewPage;

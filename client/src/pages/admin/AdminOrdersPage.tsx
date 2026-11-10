import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminOrder } from "../../types/admin";
import AdminOrderDetails from "../../components/admin/AdminOrderDetails";
import { AdminButton, AdminError, AdminFilters, AdminInput, AdminLoading, AdminModal, AdminPageHeader, AdminPagination, AdminSelect, AdminStatus, AdminTable, AdminTableHeader } from "../../components/admin/AdminUI";
import { fetchAdminOrders, updateAdminOrderStatus } from "./AdminHelper";

function AdminOrdersPage() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");
	const [paymentStatus, setPaymentStatus] = useState("");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(25);
	const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
	const [statusOrder, setStatusOrder] = useState<AdminOrder | null>(null);
	const [newStatus, setNewStatus] = useState<AdminOrder["status"]>("PENDING");
	const [statusError, setStatusError] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: ["admin", "orders", page, limit, search, status, paymentStatus, dateFrom, dateTo],
		queryFn: () => fetchAdminOrders({ page, limit, search, status, paymentStatus, dateFrom, dateTo }),
	});
	const statusMutation = useMutation({
		mutationFn: () => {
			if (!statusOrder) throw new Error("Select an order to update.");
			return updateAdminOrderStatus(statusOrder.id, newStatus);
		},
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
				queryClient.invalidateQueries({ queryKey: ["admin", "overview"] }),
			]);
			setStatusOrder(null);
			setStatusError(null);
		},
		onError: (error: Error) => setStatusError(error.message),
	});
	const orders = query.data?.items ?? [];

	return (
		<>
			<AdminPageHeader title="Orders" description="Search and review orders from across the marketplace." />
			<AdminFilters>
				<AdminInput aria-label="Search order ID or customer" placeholder="Search order ID or customer" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="w-full sm:w-64" />
				<AdminSelect aria-label="Filter by order status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
					<option value="">All order statuses</option>
					{["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((value) => <option key={value} value={value}>{value}</option>)}
				</AdminSelect>
				<AdminSelect aria-label="Filter by payment status" value={paymentStatus} onChange={(event) => { setPaymentStatus(event.target.value); setPage(1); }}>
					<option value="">All payment statuses</option>
					{["PENDING", "PAID", "FAILED", "REFUNDED"].map((value) => <option key={value} value={value}>{value}</option>)}
				</AdminSelect>
				<label className="flex items-center gap-2 font-label-sm text-on-surface-variant">From <AdminInput type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} /></label>
				<label className="flex items-center gap-2 font-label-sm text-on-surface-variant">To <AdminInput type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} /></label>
				<label className="flex items-center gap-2 font-label-sm text-on-surface-variant">Per page
					<AdminSelect aria-label="Orders per page" value={limit} onChange={(event) => { setLimit(Number(event.target.value)); setPage(1); }}>
						{[25, 50, 100].map((pageSize) => <option key={pageSize} value={pageSize}>{pageSize}</option>)}
					</AdminSelect>
				</label>
			</AdminFilters>
			{query.isPending && <AdminLoading />}
			{query.isError && <AdminError message={`Failed to load orders: ${query.error.message}`} />}
			{query.data && (
				<>
					<AdminTable empty={orders.length === 0}>
						<AdminTableHeader columns={["Order ID", "Customer", "Date", "Items", "Total", "Payment Method", "Payment Status", "Order Status", "Actions"]} />
						<tbody className="font-body-sm">
							{orders.map((order) => {
								const itemCount = order.sellerOrders.reduce((count, sellerOrder) => count + sellerOrder.orderItems.reduce((sum, item) => sum + item.quantity, 0), 0);
								return (
									<tr key={order.id} className="border-t border-surface-container hover:bg-surface-container-low/50">
										<td className="px-space-md py-3 font-label-sm">{order.id.slice(0, 8)}…</td>
										<td className="px-space-md py-3"><span className="block font-label-md font-semibold">{order.fullname}</span><span className="font-label-sm text-on-surface-variant">{order.user.email}</span></td>
										<td className="whitespace-nowrap px-space-md py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
										<td className="px-space-md py-3">{itemCount}</td>
										<td className="whitespace-nowrap px-space-md py-3">{Number(order.totalAmount).toLocaleString("en-EG", { maximumFractionDigits: 2 })} EGP</td>
										<td className="px-space-md py-3">{order.payment?.method ?? "—"}</td>
										<td className="px-space-md py-3">{order.payment ? <AdminStatus>{order.payment.status}</AdminStatus> : "—"}</td>
										<td className="px-space-md py-3">
											<div className="flex flex-col items-start gap-1">
												<AdminStatus>{order.status}</AdminStatus>
												
											</div>
										</td>
										<td className="px-space-md py-3"><div className="flex gap-2"><AdminButton type="button" onClick={() => setSelectedOrder(order)}>Details</AdminButton><AdminButton type="button" onClick={() => { setStatusOrder(order); setNewStatus(order.status as AdminOrder["status"]); setStatusError(null); }}>Change Status</AdminButton></div></td>
									</tr>
								);
							})}
						</tbody>
					</AdminTable>
					<AdminPagination page={query.data.pagination.page} totalPages={query.data.pagination.totalPages} totalCount={query.data.pagination.totalCount} onPageChange={setPage} />
				</>
			)}
			{selectedOrder && <AdminOrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
			{statusOrder && (
				<AdminModal title="Change marketplace order status" onClose={() => { if (!statusMutation.isPending) setStatusOrder(null); }}>
					<form onSubmit={(event) => { event.preventDefault(); statusMutation.mutate(); }} className="flex flex-col gap-space-md">
						<p className="font-body-sm text-on-surface-variant">
							This changes the parent marketplace order only. Seller package statuses are not changed.
						</p>
						<label className="flex flex-col gap-1 font-label-sm">
							Order status
							<AdminSelect value={newStatus} onChange={(event) => {
								const value = event.target.value;
								if (["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(value)) {
									setNewStatus(value as AdminOrder["status"]);
								}
							}} disabled={statusMutation.isPending}>
								{["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((value) => <option key={value} value={value}>{value}</option>)}
							</AdminSelect>
						</label>
						{statusError && <AdminError message={statusError} />}
						<div className="flex justify-end gap-2">
							<AdminButton type="button" disabled={statusMutation.isPending} onClick={() => setStatusOrder(null)}>Cancel</AdminButton>
							<AdminButton type="submit" variant="primary" disabled={statusMutation.isPending || newStatus === statusOrder.status}>{statusMutation.isPending ? "Saving..." : "Save status"}</AdminButton>
						</div>
					</form>
				</AdminModal>
			)}
		</>
	);
}

export default AdminOrdersPage;

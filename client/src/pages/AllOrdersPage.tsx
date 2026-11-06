import { useEffect, useState } from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersFilter from "../components/orders/OrdersFilter";
import OrdersList from "../components/orders/OrdersList";
import { fetchOrders } from "../components/order/OrderHelper";
import type { Order } from "../types/order";

function AllOrdersPage({ wishlist }: { wishlist: string[] }) {
	const [selectedStatus, setSelectedStatus] = useState("ALL");
	const [orders, setOrders] = useState<Order[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		fetchOrders()
			.then((fetchedOrders) => {
				if (!cancelled) {
					setOrders(fetchedOrders);
					setError(null);
				}
			})
			.catch((fetchError: unknown) => {
				if (!cancelled) {
					setError(
						fetchError instanceof Error
							? fetchError.message
							: "Failed to fetch orders",
					);
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	const filteredOrders = selectedStatus === "ALL"
		? orders
		: orders.filter((order) => order.status === selectedStatus);

	return (
		<main className="min-h-screen bg-surface">
			<div className="mx-auto max-w-7xl px-margin py-space-xl">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
					<aside className="lg:col-span-3">
						<ProfileSidebar wishlist={wishlist} />
					</aside>

					<section className="lg:col-span-9 flex flex-col gap-space-lg">
						<OrdersHeader totalOrders={orders.length} />
						<OrdersFilter
							selectedStatus={selectedStatus}
							onStatusChange={setSelectedStatus}
						/>
						{error ? (
							<p role="alert" className="rounded-xl bg-error-container p-space-lg text-on-error-container">
								{error}
							</p>
						) : (
							<OrdersList orders={filteredOrders} />
						)}
					</section>
				</div>
			</div>
		</main>
	);
}

export default AllOrdersPage;

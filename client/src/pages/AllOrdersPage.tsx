import { useState, useEffect } from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersFilter from "../components/orders/OrdersFilter";
import OrdersList from "../components/orders/OrdersList";
import type {Order} from "../types/order";


function AllOrdersPage() {
	const [selectedStatus, setSelectedStatus] = useState("ALL");
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		fetchOrders().then((orders) => {
			// Handle the fetched orders here
			setOrders(orders);
		});
	}, []);

	async function fetchOrders(): Promise<Order[]> {
		const token = localStorage.getItem("token");
		const response = await fetch("http://localhost:5000/orders", 
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			}
		);
		const data = await response.json();
		return data;
	}

	const filteredOrders = selectedStatus === "ALL"
		? orders
		: orders.filter((order) => order.status === selectedStatus);

	return (
		<main className="min-h-screen bg-surface">
			<div className="mx-auto max-w-7xl px-margin py-space-xl">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
					<aside className="lg:col-span-3">
						<ProfileSidebar />
					</aside>

					<section className="lg:col-span-9 flex flex-col gap-space-lg">
						<OrdersHeader totalOrders={orders.length} />
						<OrdersFilter
							selectedStatus={selectedStatus}
							onStatusChange={setSelectedStatus}
						/>
						<OrdersList orders={filteredOrders} />
					</section>
				</div>
			</div>
		</main>
	);
}

export default AllOrdersPage;
import DashboardMetrics from "../../components/seller/dashboard/DashboardMetrics";
import DashboardWelcome from "../../components/seller/dashboard/DashboardWelcome";
import InventoryStock from "../../components/seller/dashboard/InventoryStock";
import RecentOrdersTable from "../../components/seller/dashboard/RecentOrdersTable";
import RevenueTrend from "../../components/seller/dashboard/RevenueTrend";
import SellerSidebar from "../../components/seller/dashboard/SellerSidebar";
import SellerTopBar from "../../components/seller/dashboard/SellerTopBar";

import { useQuery } from "@tanstack/react-query";
import { fetchSeller, fetchSellerOrders, fetchSellerProducts } from "./SellerHelper";
import { getCurrentUserId } from "../../utils/currentUser";
import { useNavigate } from "react-router-dom";

function SellerDashboard({ onLogout }: { onLogout: () => void }) {
    const userId = getCurrentUserId();
	const navigate = useNavigate();

    const sellerQuery = useQuery({
		queryKey: ["seller", userId],
		queryFn: () => {
			if (!userId) throw new Error("Your session has no user ID. Please log in again.");
			return fetchSeller(userId);
		},
		enabled: Boolean(userId),
	});

	const seller = sellerQuery.data;
    const ordersQuery = useQuery({
        queryKey: ["seller", userId, "orders", seller?.id],
        queryFn: () => {
			if (!seller) throw new Error("Seller profile is not available.");
			return fetchSellerOrders(seller.id);
		},
		enabled: Boolean(seller),
    });

    const productsQuery = useQuery({
        queryKey: ["seller", userId, "products", seller?.id],
        queryFn: () => {
			if (!seller) throw new Error("Seller profile is not available.");
			return fetchSellerProducts(seller.id);
		},
		enabled: Boolean(seller),
    });

    const orders = ordersQuery.data;
    const products = productsQuery.data;

	return (
		<div className="min-h-screen bg-background font-body-md text-on-surface antialiased">
			<SellerSidebar onLogout={onLogout} />
			<div className="min-h-screen pl-72">
				{seller && <SellerTopBar seller={seller} />}
				<main
					id="overview"
					className="flex flex-col gap-space-lg px-space-lg pb-space-xl pt-24"
				>
					{!userId && <p role="alert" className="text-error">Your session has no user ID. Please log in again.</p>}
					{userId && sellerQuery.isPending && <p>Loading seller profile...</p>}
					{sellerQuery.isError && <p role="alert" className="text-error">Failed to load seller profile: {sellerQuery.error.message}</p>}
					{seller && (
						<>
							<DashboardWelcome seller={seller} onAddProduct={() => navigate("/seller-products?addProduct=1")} />
							{(ordersQuery.isPending || productsQuery.isPending) && <p>Loading dashboard data...</p>}
							{ordersQuery.isError && <p role="alert" className="text-error">Failed to load orders: {ordersQuery.error.message}</p>}
							{productsQuery.isError && <p role="alert" className="text-error">Failed to load products: {productsQuery.error.message}</p>}
							{orders && products && <DashboardMetrics orders={orders} products={products} />}
							{orders && (
								<div className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
									<RevenueTrend orders={orders} />
								</div>
							)}
							<div className="grid grid-cols-1 gap-space-lg xl:grid-cols-12">
								{orders && <RecentOrdersTable orders={orders} />}
								{products && <InventoryStock products={products} />}
							</div>
						</>
					)}
				</main>
			</div>
		</div>
	);
}

export default SellerDashboard;
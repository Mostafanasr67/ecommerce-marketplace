import { useState, useEffect } from "react";
import type { SellerOrder } from "../../types/seller";
import OrdersPageHeader from "../../components/seller/orders/OrdersPageHeader";
import OrdersTable from "../../components/seller/orders/OrdersTable";
import PaginationBar from "../../components/seller/orders/PaginationBar";
import { fetchSellerOrders as fetchSellerOrdersAPI, fetchSeller, updateSellerOrderStatus } from "./SellerHelper";
import { getCurrentSellerId, getCurrentUserId } from "../../utils/currentSeller";
import SellerTopBar from "../../components/seller/dashboard/SellerTopBar";
import SellerSidebar from "../../components/seller/dashboard/SellerSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 4;

function SellerOrdersPage({onLogout}: {onLogout: () => void}) {
	const [orders, setOrders] = useState<SellerOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [updatingOrderIds, setUpdatingOrderIds] = useState<string[]>([]);
	const [statusError, setStatusError] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const [activeOrderId, setActiveOrderId] = useState<string | undefined>(
		undefined,
	);

	const userId = getCurrentUserId();

    const sellerQuery = useQuery({
		queryKey: ["seller", userId],
		queryFn: () => {
			if (!userId) throw new Error("Your session has no user ID. Please log in again.");
			return fetchSeller(userId);
		},
		enabled: Boolean(userId),
	});

	const seller = sellerQuery.data;

	// Fetch orders from API
	useEffect(() => {
		const fetchSellerOrders = async () => {
			try {
				setLoading(true);

				// Get seller ID from database using user ID from localStorage
				const sellerId = await getCurrentSellerId();

				if (!sellerId) {
					throw new Error("Seller ID not found. Please log in as a seller.");
				}

				console.log("Fetching orders for seller:", sellerId);
				const data = await fetchSellerOrdersAPI(sellerId);
				setOrders(data);
				setError(null);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to fetch orders";
				console.error("Error fetching orders:", errorMessage);
				setError(errorMessage);
				setOrders([]);
			} finally {
				setLoading(false);
			}
		};

		fetchSellerOrders();
	}, []);

	// Calculate pagination
	const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const paginatedOrders = orders.slice(startIndex, endIndex);

	const handleViewOrder = (orderId: string) => {
		setActiveOrderId((current) => current === orderId ? undefined : orderId);
	};

	const handleStatusChange = async (orderId: string, status: SellerOrder["status"]) => {
		const order = orders.find((item) => item.id === orderId);
		if (!order) {
			setStatusError("Order not found. Please refresh and try again.");
			return;
		}
		setStatusError(null);
		setUpdatingOrderIds((current) => [...current, orderId]);
		try {
			const updated = await updateSellerOrderStatus(order.sellerId, orderId, status);
			setOrders((current) => current.map((item) => item.id === updated.id ? { ...item, status: updated.status } : item));
			void queryClient.invalidateQueries({ queryKey: ["seller", userId] });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to update order status";
			setStatusError(message);
			console.error("Error updating order status:", err);
		} finally {
			setUpdatingOrderIds((current) => current.filter((id) => id !== orderId));
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	if (loading) {
		return (
			<main className="min-h-screen bg-surface p-space-lg">
				<div className="mx-auto max-w-7xl">
					<div className="flex items-center justify-center py-space-xl">
						<div className="text-center">
							<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-space-md"></div>
							<p className="font-body-md text-on-surface-variant">
								Loading orders...
							</p>
						</div>
					</div>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="min-h-screen bg-surface p-space-lg">
				<div className="mx-auto max-w-7xl">
					<div className="rounded-xl bg-error-container p-space-lg">
						<div className="flex items-center gap-space-md">
							<span className="material-symbols-outlined text-[24px] text-error">
								error
							</span>
							<div>
								<h2 className="font-title-md text-title-md text-on-error-container font-bold">
									Error Loading Orders
								</h2>
								<p className="font-body-md text-on-error-container">{error}</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}

	return (
		<div className="min-h-screen bg-background font-body-md text-on-surface antialiased">
			<SellerSidebar onLogout={onLogout} />
			<div className="min-h-screen pl-72">
				{seller && <SellerTopBar seller={seller} />}
				<main className="min-h-screen bg-surface pt-20">
					<div className="px-margin py-space-xl">
						<OrdersPageHeader
							totalOrders={orders.length}
						/>

						<div className="mt-space-lg">
							<div className="flex min-w-0 flex-col gap-space-md">
								{statusError && <p role="alert" className="rounded-xl bg-error-container p-space-md text-on-error-container">{statusError}</p>}
								<OrdersTable
									orders={paginatedOrders}
									activeOrderId={activeOrderId}
									onViewOrder={handleViewOrder}
									onStatusChange={handleStatusChange}
									updatingOrderIds={updatingOrderIds}
								/>
								{orders.length > 0 && (
									<PaginationBar
										currentPage={currentPage}
										totalPages={totalPages}
										totalOrders={orders.length}
										onPrevious={handlePreviousPage}
										onNext={handleNextPage}
									/>
								)}
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default SellerOrdersPage;

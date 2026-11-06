import { useEffect, useState } from "react";
import CheckoutProgress from "../components/user/cart/CheckoutProgress";
import DeliveryHandoverCard from "../components/user/order/DeliveryHandoverCard";
import OrderActions from "../components/user/order/OrderActions";
import OrderConfirmationHeader from "../components/user/order/OrderConfirmationHeader";
import { fetchOrders, type Order } from "../components/user/order/OrderHelper";
import OrderPaymentCard from "../components/user/order/OrderPaymentCard";
import PurchasedItems from "../components/user/order/PurchasedItems";
import SplitDispatchCard from "../components/user/order/SplitDispatchCard";

function OrderPage() {
	const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const loadLastOrder = async () => {
            const orders = await fetchOrders();
            if (orders.length > 0) {
                setOrder(orders.at(-1) || null);
            }
        };
        loadLastOrder();
    }, []);

    if (!order) {
        return <div>Loading...</div>;
    }

	return (
		<main className="min-h-screen bg-surface">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-space-xl px-margin py-space-xl">
				<CheckoutProgress activeStep={4} />
				<OrderConfirmationHeader order={order} />
				<OrderActions />

				<div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
					<DeliveryHandoverCard order={order} />
					<OrderPaymentCard order={order} />
					<SplitDispatchCard />
				</div>

				<PurchasedItems order={order} />
			</div>
		</main>
	);
}

export default OrderPage;
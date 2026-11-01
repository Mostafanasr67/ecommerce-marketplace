import CheckoutProgress from "../components/cart/CheckoutProgress";
import CustomerCarePanel from "../components/order/CustomerCarePanel";
import DeliveryHandoverCard from "../components/order/DeliveryHandoverCard";
import OrderActions from "../components/order/OrderActions";
import OrderConfirmationHeader from "../components/order/OrderConfirmationHeader";
import OrderEscrowNotice from "../components/order/OrderEscrowNotice";
import OrderFinancialSummary from "../components/order/OrderFinancialSummary";
import OrderPaymentCard from "../components/order/OrderPaymentCard";
import PurchasedItems from "../components/order/PurchasedItems";
import SplitDispatchCard from "../components/order/SplitDispatchCard";

function OrderPage() {
	return (
		<main className="min-h-screen bg-surface">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-space-xl px-margin py-space-xl">
				<CheckoutProgress activeStep={4} />
				<OrderConfirmationHeader />
				<OrderEscrowNotice />
				<OrderActions />

				<div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
					<DeliveryHandoverCard />
					<OrderPaymentCard />
					<SplitDispatchCard />
				</div>

				<PurchasedItems />

				<div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
					<CustomerCarePanel />
					<OrderFinancialSummary />
				</div>
			</div>
		</main>
	);
}

export default OrderPage;
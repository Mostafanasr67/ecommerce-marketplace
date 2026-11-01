import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchCartItems } from "../components/cart/CartHelper";
import CheckoutProgress from "../components/cart/CheckoutProgress";
import OrderSummary from "../components/cart/OrderSummary";
import FulfillmentSchedule from "../components/address/FulfillmentSchedule";
import PaymentProductList from "../components/payment/PaymentProductList";
import PaymentMethods from "../components/payment/PaymentMethods";
import ShippingAddress from "../components/payment/ShippingAddress";
import type { SavedCard } from "../components/payment/CardHelper";
import type { Address } from "../components/address/AddressHelper";



function PaymentPage({ selectedAddress, paymentMethod, setPaymentMethod }: { selectedAddress: Address | null; paymentMethod: string; setPaymentMethod: (method: string) => void }) {
	const [selectedCard, setSelectedCard] = useState<SavedCard | null>(null);

	const cartQuery = useQuery({
		queryKey: ["cart"],
		queryFn: fetchCartItems,
	});
	const items = useMemo(() => cartQuery.data ?? [], [cartQuery.data]);

    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
	const subTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
	const savings = items.reduce(
		(total, item) =>
			total +
			(item.originalPrice ? item.originalPrice - item.product.price : 0) * item.quantity,
		0,
	);

	return (
		<main className="min-h-screen bg-surface">
			<div className="mx-auto w-full max-w-7xl px-margin py-space-xl">
				<CheckoutProgress activeStep={3} />

				<div className="grid grid-cols-12 items-start gap-space-lg">
					<section className="col-span-12 flex flex-col gap-space-lg lg:col-span-8">
						<ShippingAddress address={selectedAddress} />
						<PaymentProductList items={items} />
						<PaymentMethods
							paymentMethod={paymentMethod}
							setPaymentMethod={setPaymentMethod}
							selectedCard={selectedCard}
							setSelectedCard={setSelectedCard}
						/>
					</section>

					<div className="col-span-12 flex flex-col gap-space-lg lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
						<OrderSummary
							itemCount={itemCount}
							subtotal={subTotal}
							savings={savings}
							delivery={35}
							selectedAddress={selectedAddress}
							paymentMethod={paymentMethod}
						/>
						<FulfillmentSchedule
							itemCount={itemCount}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}

export default PaymentPage;

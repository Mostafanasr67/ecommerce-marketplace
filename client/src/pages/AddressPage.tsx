import { useMemo, useState } from "react";
import CheckoutProgress from "../components/user/cart/CheckoutProgress";
import OrderSummary from "../components/user/cart/OrderSummary";
import AddressPageHeader from "../components/user/address/AddressPageHeader";
import SavedAddresses from "../components/user/address/SavedAddresses";
import NewAddressForm from "../components/user/address/NewAddressForm";
import ShipmentPreview from "../components/user/address/ShipmentPreview";
import FulfillmentSchedule from "../components/user/address/FulfillmentSchedule";
import type { Address } from "../components/user/address/AddressHelper";
import { fetchCartItems } from "../components/user/cart/CartHelper";
import { useQuery } from "@tanstack/react-query";

function AddressPage({ selectedAddress, setSelectedAddress }: { selectedAddress: Address | null; setSelectedAddress: (address: Address | null) => void }) {
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);

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
				<CheckoutProgress activeStep={2} />

				<AddressPageHeader />

				<div className="grid grid-cols-12 items-start gap-space-lg">
					<section className="col-span-12 flex flex-col gap-space-lg lg:col-span-8">
						<SavedAddresses onEdit={setEditingAddress} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
						<NewAddressForm
							key={editingAddress?.id ?? "new"}
							editingAddress={editingAddress}
							onFinish={() => setEditingAddress(null)}
						/>
					</section>

					<div className="col-span-12 flex flex-col gap-space-lg lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
						<ShipmentPreview items={items} />
						<OrderSummary
							itemCount={itemCount}
							subtotal={subTotal}
							savings={savings}
							delivery={35}
						/>
						<FulfillmentSchedule itemCount={itemCount} />
					</div>
				</div>
			</div>
		</main>
	);
}

export default AddressPage;

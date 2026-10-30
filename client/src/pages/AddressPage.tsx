import { useState } from "react";
import CheckoutProgress from "../components/cart/CheckoutProgress";
import OrderSummary from "../components/cart/OrderSummary";
import AddressPageHeader from "../components/address/AddressPageHeader";
import SavedAddresses from "../components/address/SavedAddresses";
import NewAddressForm from "../components/address/NewAddressForm";
import ShipmentPreview from "../components/address/ShipmentPreview";
import FulfillmentSchedule from "../components/address/FulfillmentSchedule";
import type { Address } from "../components/address/AddressHelper";

function AddressPage() {
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);

	return (
		<main className="min-h-screen bg-surface">
			<div className="mx-auto w-full max-w-7xl px-margin py-space-xl">
				<CheckoutProgress activeStep={2} />

				<AddressPageHeader />

				<div className="grid grid-cols-12 items-start gap-space-lg">
					<section className="col-span-12 flex flex-col gap-space-lg lg:col-span-8">
						<SavedAddresses onEdit={setEditingAddress} />
						<NewAddressForm
							key={editingAddress?.id ?? "new"}
							editingAddress={editingAddress}
							onFinish={() => setEditingAddress(null)}
						/>
					</section>

					<div className="col-span-12 flex flex-col gap-space-lg lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
						<ShipmentPreview />
						<OrderSummary
							itemCount={3}
							subtotal={5039}
							savings={701}
							delivery={120}
						/>
						<FulfillmentSchedule />
					</div>
				</div>
			</div>
		</main>
	);
}

export default AddressPage;
import OrderIcon from "./OrderIcon";

function OrderEscrowNotice() {
	return (
		<section className="flex items-start gap-space-md rounded-xl bg-surface-container-low p-space-md sm:items-center">
			<OrderIcon name="gavel" className="mt-0.5 h-7 w-7 text-primary sm:mt-0" />
			<p className="flex-1 font-body-sm text-body-sm leading-snug text-on-surface-variant">
				<strong className="font-semibold text-on-surface">Sovereign Vault Guarantee:</strong> Your payment of{" "}
				<strong className="font-semibold text-on-surface">5,074 EGP</strong> is safely deposited in Sovereign Escrow under Central Bank of Egypt (CBE) marketplace standards. Funds will only disburse to certified vendors after you inspect and accept your delivery parcel.
			</p>
			<span className="hidden shrink-0 items-center gap-1 font-label-md text-label-md font-bold text-primary lg:inline-flex">
				<OrderIcon name="lock" className="h-4 w-4" />
				100% Protected
			</span>
		</section>
	);
}

export default OrderEscrowNotice;

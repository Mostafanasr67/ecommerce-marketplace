import OrderIcon from "./OrderIcon";

function OrderPaymentCard() {
	return (
		<section className="flex h-full flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex flex-col gap-space-md">
				<div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
					<div className="flex items-center gap-space-xs font-headline-sm text-headline-sm font-bold text-primary">
						<OrderIcon name="wallet" className="h-6 w-6" />
						<span>Payment &amp; Vault</span>
					</div>
					<span className="rounded bg-primary/10 px-2 py-0.5 font-label-sm text-label-sm font-bold text-primary">
						ESCROW SECURED
					</span>
				</div>

				<div className="flex items-center gap-space-md rounded-xl bg-surface-container-low p-space-md">
					<div className="flex h-8 w-12 shrink-0 items-center justify-center rounded-md bg-inverse-surface text-xs font-bold tracking-wider text-inverse-on-surface">
						NBE
					</div>
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-label-lg text-label-lg font-bold text-on-surface">NBE Platinum Mastercard</span>
						<span className="font-label-md text-label-md text-outline">•••• •••• •••• 8842</span>
					</div>
				</div>

				<div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
					<div className="flex justify-between py-1">
						<span className="text-on-surface-variant">Transaction State</span>
						<span className="flex items-center gap-1 font-bold text-primary">
							<span className="inline-block h-2 w-2 rounded-full bg-primary" />
							Authorized &amp; Escrow Held
						</span>
					</div>
					<div className="flex justify-between py-1">
						<span className="text-on-surface-variant">Tax ID Registered</span>
						<span className="font-semibold text-on-surface">EG-938210492</span>
					</div>
					<div className="flex justify-between py-1">
						<span className="text-on-surface-variant">Billing Address</span>
						<span className="font-semibold text-on-surface">Same as Delivery</span>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between rounded-lg bg-surface-container p-space-sm">
				<span className="font-label-md text-label-md text-on-surface-variant">Total Captured Amount</span>
				<span className="font-price-sm text-price-sm font-extrabold text-primary">5,074 EGP</span>
			</div>
		</section>
	);
}

export default OrderPaymentCard;

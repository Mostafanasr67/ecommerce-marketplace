import OrderIcon from "./OrderIcon";

function OrderFinancialSummary() {
	return (
		<section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-5">
			<div className="flex items-center justify-between pb-space-xs">
				<span className="font-title-md text-title-md font-bold text-on-surface">Financial Settlement Summary</span>
				<span className="font-label-sm text-label-sm text-outline">EGP (Egyptian Pound)</span>
			</div>

			<div className="flex flex-col gap-2.5 font-body-sm text-body-sm">
				<div className="flex items-center justify-between text-on-surface-variant">
					<span>Items Subtotal (3 units)</span>
					<span className="font-semibold text-on-surface">5,039 EGP</span>
				</div>
				<div className="flex items-center justify-between text-primary">
					<span className="flex items-center gap-1">
						<OrderIcon name="tag" className="h-4 w-4" />
						Vendor Promotional Savings
					</span>
					<span className="font-bold">-701 EGP</span>
				</div>
				<div className="flex items-center justify-between text-on-surface-variant">
					<span>Dokki Express Delivery (Package 1)</span>
					<span className="font-label-md text-label-md font-bold uppercase text-primary">FREE</span>
				</div>
				<div className="flex items-center justify-between text-on-surface-variant">
					<span>Artisan Direct Shipping (Package 2)</span>
					<span className="font-semibold text-on-surface">35 EGP</span>
				</div>
				<div className="flex items-center justify-between text-primary">
					<span className="flex items-center gap-1">
						<OrderIcon name="ticket" className="h-4 w-4" />
						Voucher Applied (<code className="rounded bg-primary/10 px-1 text-xs font-bold">SOVEREIGNFIRST</code>)
					</span>
					<span className="font-bold">-50 EGP</span>
				</div>
				<div className="flex items-center justify-between pt-1 text-label-md text-outline">
					<span>Standard Egyptian VAT (14%)</span>
					<span>Included in item pricing</span>
				</div>
			</div>

			<div className="my-1 h-px w-full bg-surface-container-high" />

			<div className="flex items-baseline justify-between">
				<div className="flex flex-col">
					<span className="font-headline-sm text-headline-sm font-extrabold text-on-surface">Total Paid</span>
					<span className="font-label-sm text-label-sm font-semibold text-primary">Authorized via NBE Mastercard Vault</span>
				</div>
				<span className="font-headline-lg text-headline-lg font-extrabold tracking-tight text-primary">5,074 EGP</span>
			</div>

			<div className="mt-space-xs flex items-center justify-between rounded-lg bg-surface-container-low p-space-sm font-label-md text-label-md text-on-surface-variant">
				<span className="flex items-center gap-1">
					<OrderIcon name="receipt" className="h-4 w-4 text-outline" />
					Tax Invoice Number
				</span>
				<span className="font-bold text-on-surface">INV-2025-09412</span>
			</div>
		</section>
	);
}

export default OrderFinancialSummary;

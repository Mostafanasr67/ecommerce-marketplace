import OrderIcon from "./OrderIcon";

function DeliveryHandoverCard() {
	return (
		<section className="flex h-full flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex flex-col gap-space-md">
				<div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
					<div className="flex items-center gap-space-xs font-headline-sm text-headline-sm font-bold text-primary">
						<OrderIcon name="home" className="h-6 w-6" />
						<span>Delivery Handover</span>
					</div>
					<span className="rounded bg-surface-container px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-surface">
						RESIDENTIAL
					</span>
				</div>

				<div className="flex flex-col gap-space-xs">
					<div className="flex items-center justify-between">
						<span className="font-title-md text-title-md font-bold text-on-surface">Karim M.</span>
						<span className="font-label-md text-label-md text-outline">Dokki, Giza</span>
					</div>
					<p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
						Building 14, El-Messaha Square, Apt 5B, Floor 5
						<br />
						Dokki, Giza Governorate, Egypt
					</p>
					<div className="mt-1 flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
						<OrderIcon name="navigation" className="h-4 w-4 text-outline" />
						<span>Landmark: Near Dokki Metro &amp; Seif Pharmacy</span>
					</div>
				</div>

				<div className="rounded-lg bg-surface-container-low p-space-sm">
					<span className="mb-1 block font-label-sm text-label-sm uppercase text-outline">
						Courier Special Instructions
					</span>
					<p className="font-body-sm text-body-sm font-medium italic text-on-surface">
						"Ring doorbell twice, leave with doorman (Am Gad) if unavailable."
					</p>
				</div>
			</div>

			<div className="flex items-center justify-between rounded-lg bg-surface-container-low/50 p-2.5">
				<div className="flex items-center gap-space-xs">
					<OrderIcon name="phone" className="h-4 w-4 text-primary" />
					<span className="font-label-md text-label-md font-semibold text-on-surface">+20 100 234 5678</span>
				</div>
				<span className="font-label-sm text-label-sm text-outline">OTP Required at Door</span>
			</div>
		</section>
	);
}

export default DeliveryHandoverCard;

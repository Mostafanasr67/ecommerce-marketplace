import OrderIcon from "./OrderIcon";
import TrustBadge from "./TrustBadge";

function CustomerCarePanel() {
	return (
		<div className="flex flex-col gap-space-md lg:col-span-7">
			<section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
				<div className="flex items-center gap-space-sm font-headline-sm text-headline-sm font-bold text-on-surface">
					<OrderIcon name="headset" className="h-7 w-7 text-primary" />
					<span>Need to Adjust or Modify This Order?</span>
				</div>
				<p className="font-body-md leading-relaxed text-on-surface-variant">
					You can modify delivery instructions, adjust phone verification, or request instant pre-dispatch cancellation within{" "}
					<strong className="font-semibold text-on-surface">60 minutes</strong> directly from your dashboard or by contacting our 24/7 dedicated Cairo dispatch operations center.
				</p>
				<div className="flex flex-wrap items-center gap-space-md pt-space-xs">
					<a
						href="tel:19855"
						className="flex h-11 items-center gap-space-xs rounded-lg bg-surface-container px-space-lg font-label-lg text-label-lg font-bold text-on-surface transition-colors hover:bg-surface-variant"
					>
						<OrderIcon name="phone" className="h-5 w-5 text-primary" />
						<span>Direct Hotline: 19855</span>
					</a>
					<button
						type="button"
						className="flex h-11 items-center gap-space-xs px-space-md font-label-lg text-label-lg font-bold text-primary transition-colors hover:text-primary-container"
					>
						<OrderIcon name="edit" className="h-5 w-5" />
						<span>Modify Delivery Notes</span>
					</button>
				</div>
			</section>

			<div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
				<TrustBadge icon="verified" title="100% Genuine" subtitle="Verified Merchant Guild" />
				<TrustBadge icon="lock" title="CBE Escrow Held" subtitle="Released Post Inspection" />
				<TrustBadge icon="refresh" title="14-Day Free Return" subtitle="Doorstep Pickup in Cairo" />
			</div>
		</div>
	);
}

export default CustomerCarePanel;

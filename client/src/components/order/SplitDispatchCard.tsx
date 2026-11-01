import OrderIcon from "./OrderIcon";
import DispatchPackageStatus from "./DispatchPackageStatus";

function SplitDispatchCard() {
	return (
		<section id="dispatch-timeline" className="flex h-full flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex flex-col gap-space-md">
				<div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
					<div className="flex items-center gap-space-xs font-headline-sm text-headline-sm font-bold text-primary">
						<OrderIcon name="route" className="h-6 w-6" />
						<span>Split Dispatch Logic</span>
					</div>
					<span className="rounded bg-surface-container px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-surface-variant">
						2 PACKAGES
					</span>
				</div>

				<DispatchPackageStatus
					icon="zap"
					tone="primary"
					title="Package 1 (Sovereign Express)"
					trackingCode="SVX-CAI-99210"
					etaLabel="Guaranteed:"
					eta="Tomorrow by 2:00 PM"
					progressWidth="w-2/3"
					statusLabel="Preparing Hub"
				/>
				<DispatchPackageStatus
					icon="factory"
					tone="secondary"
					title="Package 2 (Artisan Direct)"
					trackingCode="CAL-ALX-48201"
					etaLabel="Estimated:"
					eta="Within 2–3 Business Days"
					progressWidth="w-1/3"
					statusLabel="At Workshop"
				/>
			</div>

			<div className="flex items-center gap-2 font-label-sm text-label-sm text-outline">
				<OrderIcon name="info" className="h-4 w-4" />
				<span>Packages ship independently with zero extra customer charge.</span>
			</div>
		</section>
	);
}

export default SplitDispatchCard;

import OrderIcon from "./OrderIcon";
import DispatchPackageStatus from "./DispatchPackageStatus";

function SplitDispatchCard() {
	return (
		<section id="dispatch-timeline" className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
				<div className="flex items-center gap-space-xs font-headline-sm text-headline-sm font-bold text-primary">
					<OrderIcon name="route" className="h-6 w-6" />
					<span>Dispatch Package Status</span>
				</div>
			</div>

			<div className="flex flex-col gap-space-lg">
				<DispatchPackageStatus
					icon="zap"
					tone="primary"
					title="Package"
					trackingCode=""
					etaLabel="Guaranteed:"
					eta="Within 2-3 Days"
					progressWidth="w-2/3"
					statusLabel="Preparing Hub"
				/>

				<div className="flex flex-col gap-space-md">
					<h3 className="font-title-md text-title-md font-bold text-on-surface">Timeline</h3>
					<div className="space-y-space-sm">
						<div className="flex items-start gap-space-md">
							<div className="mt-1.5 h-3 w-3 rounded-full bg-primary flex-shrink-0" />
							<div>
								<p className="font-label-lg text-label-lg font-bold text-on-surface">Order Confirmed</p>
								<p className="font-label-md text-label-md text-on-surface-variant">Processing your order</p>
							</div>
						</div>
						<div className="flex items-start gap-space-md">
							<div className="mt-1.5 h-3 w-3 rounded-full bg-surface-container-high flex-shrink-0" />
							<div>
								<p className="font-label-lg text-label-lg font-bold text-on-surface">In Transit</p>
								<p className="font-label-md text-label-md text-on-surface-variant">Your package is on the way</p>
							</div>
						</div>
						<div className="flex items-start gap-space-md">
							<div className="mt-1.5 h-3 w-3 rounded-full bg-surface-container-high flex-shrink-0" />
							<div>
								<p className="font-label-lg text-label-lg font-bold text-on-surface">Out for Delivery</p>
								<p className="font-label-md text-label-md text-on-surface-variant">Package will arrive within 2-3 days</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default SplitDispatchCard;

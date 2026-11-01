import OrderIcon from "./OrderIcon";

function OrderConfirmationHeader() {
	return (
		<section className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
			<div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />
			<div className="absolute right-0 top-0 hidden items-center gap-space-xs p-space-md md:flex">
				<span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-space-md py-1 font-label-md text-label-md font-bold text-on-surface">
					<span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
					Escrow Locked ID: SOV-849204-EG
				</span>
			</div>

			<div className="flex flex-col items-start gap-space-lg md:flex-row md:items-center">
				<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/25">
					<OrderIcon name="verified" className="h-10 w-10" />
				</div>
				<div className="flex flex-1 flex-col gap-space-xs">
					<div className="flex flex-wrap items-center gap-space-sm">
						<h1 className="font-headline-lg text-headline-lg font-extrabold tracking-tight text-on-surface">
							Thank You, Karim! Your Order Has Been Placed.
						</h1>
						<span className="rounded bg-primary/10 px-space-sm py-0.5 font-label-sm text-label-sm font-bold text-primary">
							CONFIRMED
						</span>
					</div>
					<p className="max-w-3xl font-body-md text-body-md text-on-surface-variant">
						Order <strong className="font-bold text-on-surface">#SOV-849204-EG</strong> is authorized. A digital receipt and SMS tracking PIN have been dispatched to{" "}
						<span className="font-semibold text-on-surface">+20 100 234 5678</span> and{" "}
						<span className="font-semibold text-on-surface">karim.m@example.com</span>.
					</p>
				</div>
			</div>
		</section>
	);
}

export default OrderConfirmationHeader;

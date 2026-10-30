const packages = [
	{
		id: "package-1",
		title: "Package 1 (2 items)",
		badge: "⚡ Express Dispatch",
		badgeClass: "text-surface-tint",
		titleClass: "text-primary",
		merchant: "Fulfilled by Sovereign Express Hub",
		arrival: "Tomorrow by 2:00 PM",
	},
	{
		id: "package-2",
		title: "Package 2 (1 item)",
		badge: "Direct Merchant",
		badgeClass: "text-outline",
		titleClass: "text-outline",
		merchant: "Cairo Apparel Lab Workshop",
		arrival: "2 - 3 Business Days",
	},
];

function FulfillmentSchedule() {
	return (
		<section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
			<div className="flex items-center gap-space-xs">
				<span aria-hidden="true">📦</span>
				<h3 className="font-label-lg text-label-lg font-bold text-on-surface">
					Fulfillment Schedule
				</h3>
			</div>

			{packages.map((pkg) => (
				<div
					key={pkg.id}
					className="flex flex-col gap-0.5 rounded-lg bg-surface-container-low p-space-sm"
				>
					<div className="flex items-center justify-between">
						<span
							className={`font-label-sm text-label-sm font-bold uppercase ${pkg.titleClass}`}
						>
							{pkg.title}
						</span>
						<span
							className={`flex items-center gap-0.5 font-label-sm text-label-sm font-bold ${pkg.badgeClass}`}
						>
							{pkg.badge}
						</span>
					</div>
					<span className="font-label-md text-label-md font-semibold text-on-surface">
						{pkg.merchant}
					</span>
					<div className="flex items-center gap-1 pt-0.5 font-body-sm text-body-sm text-on-surface-variant">
						<span aria-hidden="true" className="text-xs">
							🕒
						</span>
						<span>
							Arrives: <strong>{pkg.arrival}</strong>
						</span>
					</div>
				</div>
			))}
		</section>
	);
}

export default FulfillmentSchedule;

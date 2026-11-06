

function FulfillmentSchedule({ itemCount }: { itemCount: number }) {
	return (
		<section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
			<div className="flex items-center gap-space-xs">
				<span aria-hidden="true">📦</span>
				<h3 className="font-label-lg text-label-lg font-bold text-on-surface">
					Fulfillment Schedule
				</h3>
			</div>

			
				<div
					className="flex flex-col gap-0.5 rounded-lg bg-surface-container-low p-space-sm"
				>
					<div className="flex items-center justify-between">
						<span
							className={`font-label-sm text-label-sm font-bold uppercase text-primary`}
						>
							Package ({itemCount} items)
						</span>
						
					</div>
					<span className="mt-2 font-label-md text-label-md font-semibold text-on-surface">
						Fulfilled by Sovereign Express Hub
					</span>
					<div className="flex items-center gap-1 pt-0.5 font-body-sm text-body-sm text-on-surface-variant">
						<span aria-hidden="true" className="text-xs">
							🕒
						</span>
						<span>
							Arrives: <strong>2-3 Business Days</strong>
						</span>
					</div>
				</div>
			
		</section>
	);
}

export default FulfillmentSchedule;

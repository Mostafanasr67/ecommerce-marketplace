import type { CartItemView } from "../../../types/cart";


function ShipmentPreview({ items }: { items: CartItemView[] }) {
	return (
		<section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-container-low p-space-sm">
				<div className="flex items-center gap-space-sm">
					{items.map((item) => (
						<div
							key={item.product.id}
							className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-surface-container-lowest shadow-sm"
						>
							<img
								src={item.image}
								alt={item.product.name}
								className="h-full w-full object-cover"
							/>
						</div>
					))}
				</div>
				<div className="min-w-0 flex-1 pl-space-xs">
					<span className="block font-label-sm text-label-sm text-outline">
						Shipment
					</span>
					<span className="block truncate font-label-md text-label-md font-bold text-on-surface">
						{items.map((item) => item.product.name).join(", ")}{items.length > 1 ? ` + ${items.length - 1} more` : ""}
					</span>
				</div>
			</div>
		</section>
	);
}

export default ShipmentPreview;

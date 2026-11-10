import type { Order } from "./OrderHelper";
import PackageSection from "./PackageSection";

function PurchasedItems({order}: {order: Order}) {
	// Get total quantity from all seller orders and their order items
	const totalItems = order.sellerOrders?.reduce((sum, sellerOrder) => {
		const sellerOrderQuantity = sellerOrder.orderItems?.reduce(
			(itemSum, item) => itemSum + item.quantity,
			0
		) ?? 0;
		return sum + sellerOrderQuantity;
	}, 0) ?? 0;

	// Map seller orders to PackageSection items
	const packageSections = order.sellerOrders?.map((sellerOrder, index) => {
		const tone: "primary" | "secondary" = index === 0 ? "primary" : "secondary";
		return {
			number: index + 1,
			title: `Package ${index + 1}`,
			subtitle: `Seller ID: ${sellerOrder.sellerId}`,
			etaLabel: "Status:",
			eta: sellerOrder.status,
			trackingCode: sellerOrder.id,
			tone,
			items: (sellerOrder.orderItems ?? []).map((item) => ({
				id: item.id,
				name: item.product?.name ?? `Product ${item.productId}`,
				quantity: item.quantity,
				price: typeof item.unitPrice === "number" ? item.unitPrice.toString() : item.unitPrice,
				image: item.product?.productImages?.[0]?.url ?? "",
				details: `SKU: ${item.productId}`,
			})),
		};
	}) ?? [];

	return (
		<section className="flex flex-col gap-space-lg">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-headline-md text-headline-md font-bold text-on-surface">
						Purchased Items in this Order ({totalItems} {totalItems === 1 ? "Item" : "Items"})
					</h2>
					
				</div>
				
			</div>

			{packageSections.map((pkg) => (
				<PackageSection
					key={pkg.trackingCode}
					number={pkg.number}
					title={pkg.title}
					subtitle={pkg.subtitle}
					etaLabel={pkg.etaLabel}
					eta={pkg.eta}
					trackingCode={pkg.trackingCode}
					tone={pkg.tone}
					items={pkg.items}
				/>
			))}
		</section>
	);
}

export default PurchasedItems;

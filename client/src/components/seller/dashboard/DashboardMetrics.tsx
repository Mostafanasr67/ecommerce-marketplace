import type { SellerOrder, SellerProduct } from "../../../types/seller";

function DashboardMetrics({ orders, products }: { orders: SellerOrder[]; products: SellerProduct[] }) {
	const grossRevenue = orders
		.filter((order) => order.status !== "CANCELLED")
		.reduce((total, order) => total + Number(order.subTotal), 0);
	const lowStock = products.filter((product) => product.stock < 10).length;
	const categories = new Set(products.map((product) => product.categoryId)).size;
	const metrics = [
		{ label: "Gross Order Value", value: grossRevenue.toLocaleString("en-EG", { maximumFractionDigits: 2 }), unit: "EGP", icon: "payments", iconClass: "bg-primary-fixed text-primary", footer: "Excludes cancelled orders" },
		{ label: "Total Orders", value: orders.length.toLocaleString("en-EG"), unit: "orders", icon: "shopping_bag", iconClass: "bg-secondary-container text-on-secondary-container", footer: "All seller orders" },
		{ label: "Catalog", value: products.length.toLocaleString("en-EG"), unit: "products", icon: "inventory_2", iconClass: "bg-surface-container-high text-on-surface", footer: `${categories} categories` },
		{ label: "Inventory Attention", value: lowStock.toLocaleString("en-EG"), unit: "products", icon: "notification_important", iconClass: "bg-tertiary-fixed text-tertiary", footer: "Fewer than 10 units" },
	];

	return (
		<section className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4" aria-label="Store metrics">
			{metrics.map((metric) => (
				<article key={metric.label} className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md">
					<div className="flex items-start justify-between">
						<div className="flex flex-col">
							<span className="font-label-lg text-label-lg font-semibold text-on-surface-variant">{metric.label}</span>
							<span className="mt-1 font-label-lg text-2xl font-bold text-on-surface">
								{metric.value} <span className="font-label-lg text-label-lg font-semibold text-secondary">{metric.unit}</span>
							</span>
						</div>
						<div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${metric.iconClass}`}>
							<span className="material-symbols-outlined text-xl">{metric.icon}</span>
						</div>
					</div>
					<div className="-mx-space-md -mb-space-md mt-4 bg-surface-container-low/50 px-space-md py-3 font-label-sm text-secondary">{metric.footer}</div>
				</article>
			))}
		</section>
	);
}

export default DashboardMetrics;

import type { SellerProduct } from "../../../types/seller";

function InventoryStock({ products }: { products: SellerProduct[] }) {
	return (
		<section id="inventory" className="flex flex-col rounded-xl bg-surface-container-lowest p-space-lg shadow-sm xl:col-span-5">
			<div className="pb-space-md">
				<h2 className="font-headline-sm text-on-surface">Inventory &amp; Stock Levels</h2>
				<p className="font-label-sm text-secondary">Your most recently added products</p>
			</div>
			{products.length === 0 ? <p className="text-secondary">No products yet.</p> : (
				<div className="flex flex-col gap-2.5">
					{products.slice(0, 5).map((item) => {
						const image = item.productImages.find((productImage) => productImage.url.trim());
						const status = item.stock === 0 ? "Out of Stock" : item.stock < 10 ? "Low Stock" : "In Stock";
						const statusClass = item.stock === 0 ? "bg-error-container text-on-error-container"
							: item.stock < 10 ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-secondary-container text-on-secondary-fixed";
						return (
							<div key={item.id} className="flex items-center justify-between gap-2.5 rounded-xl bg-surface-container-low/50 p-2.5">
								<div className="flex min-w-0 items-center gap-3">
									{image ? <img className="h-11 w-11 flex-shrink-0 rounded-lg bg-surface-container object-cover" alt={image.altText} src={image.url} /> : (
										<div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
											<span className="material-symbols-outlined text-xl">inventory_2</span>
										</div>
									)}
									<div className="min-w-0">
										<h3 className="truncate font-title-md text-on-surface">{item.name}</h3>
										<div className="truncate font-label-sm text-secondary">
											{item.category.name} · {Number(item.price).toLocaleString("en-EG", { maximumFractionDigits: 2 })} EGP
										</div>
									</div>
								</div>
								<div className="flex-shrink-0 pl-2 text-right">
									<div className="font-label-md font-semibold">{item.stock} units</div>
									<span className={`inline-flex rounded-full px-2 py-0.5 font-label-sm font-semibold ${statusClass}`}>{status}</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</section>
	);
}

export default InventoryStock;

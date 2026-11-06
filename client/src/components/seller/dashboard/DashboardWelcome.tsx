import type { Seller } from "../../../types/seller";

function DashboardWelcome({ seller }: { seller: Seller }) {
	return (
		<div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-center">
			<div className="flex flex-col gap-space-xs">
				<h1 className="mt-5 mb-4 font-headline-xl text-4xl font-bold tracking-tight text-on-surface sm:text-5xl">
					Welcome back, {seller.storeName}
				</h1>
				<p className="text-body-sm text-on-surface-variant">
					Here is your store performance summary.
				</p>
			</div>
			<div className="flex flex-wrap items-center gap-space-sm">
				<button
					type="button"
					className="flex h-11 items-center gap-2 rounded-xl bg-primary-container px-space-lg font-label-lg text-on-primary shadow-sm transition-all hover:bg-primary active:scale-[0.99]"
				>
					<span className="material-symbols-outlined text-[20px]">add</span>
					<span>Add New Product</span>
				</button>
			</div>
		</div>
	);
}

export default DashboardWelcome;

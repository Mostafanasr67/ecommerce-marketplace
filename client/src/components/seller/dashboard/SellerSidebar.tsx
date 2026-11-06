import { Link } from "react-router-dom";

const navigationItems = [
	{ label: "Overview", icon: "grid_view", href: "/overview", active: true },
	{ label: "Products", icon: "inventory_2", href: "/inventory", active: false },
	{ label: "Orders", icon: "shopping_bag", href: "/recent-orders", active: false },
	{ label: "Store Settings", icon: "tune", href: "/store-settings", active: false },
];

function SellerSidebar({ onLogout }: { onLogout: () => void }) {
	return (
		<aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between bg-surface-container-lowest font-body-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
			<div className="flex flex-col">
				<div className="flex h-20 items-center justify-between px-space-lg">
					<div className="flex items-center gap-space-sm">
						<Link to="/home" className="shrink-0 flex items-center gap-space-md hover:opacity-80 transition-opacity">
						<div>
							<span className="font-headline-md font-bold tracking-tight block">
								SOVEREIGN
							</span>
							<span className="text-label-xs text-on-surface-variant block">
								THE MARKETPLACE
							</span>
						</div>
					</Link>
					</div>
					<span className="rounded-full bg-secondary-container px-2 py-0.5 font-label-sm text-on-secondary-fixed">
						HUB
					</span>
				</div>

				<div className="mt-6 px-space-md py-space-sm">
					<nav className="flex flex-col gap-1" aria-label="Seller navigation">
						{navigationItems.map((item) => (
							<Link
								key={item.label}
								to={item.href}
								className={`group flex items-center gap-space-sm rounded-xl px-space-md py-3 font-label-lg text-label-lg font-semibold transition-colors ${
									item.active
										? "bg-primary text-on-primary!"
										: "text-on-surface-variant! hover:bg-surface-container-low hover:text-on-surface!"
								}`}
								aria-current={item.active ? "page" : undefined}
							>
								<span className={`material-symbols-outlined text-xl ${
									item.active ? "text-on-primary" : "text-outline group-hover:text-primary"
								}`}>{item.icon}</span>
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			</div>

			<div className="flex flex-col gap-space-xs p-space-md">
				<nav className="flex flex-col gap-1" aria-label="Seller account">
					
					<button
						type="button"
						onClick={onLogout}
						className="flex w-full cursor-pointer items-center gap-space-sm rounded-xl px-space-md py-2.5 text-left font-label-lg text-error transition-colors hover:bg-error-container hover:text-on-error-container"
					>
						<span className="material-symbols-outlined text-[20px]">logout</span>
						<span>Logout</span>
					</button>
				</nav>
			</div>
		</aside>
	);
}

export default SellerSidebar;

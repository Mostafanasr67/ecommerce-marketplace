import { Link, useLocation } from "react-router-dom";

function ProfileSidebar({ wishlist }: { wishlist: string[] }) {
	const location = useLocation();

	const navigationItems = [
		{
			id: "profile",
			label: "My Profile",
			icon: "person",
			path: "/profile",
			badge: null,
		},
		{
			id: "orders",
			label: "My Orders",
			icon: "shopping_bag",
			path: "/orders",
			badge: null,
		},
		{
			id: "wishlist",
			label: "Wishlist",
			icon: "favorite",
			path: "/wishlist",
			badge: wishlist.length > 0 ? wishlist.length : null,
		}
	];

	const isActive = (path: string) => location.pathname === path;

	return (
		<aside className="flex flex-col gap-space-lg">
			{/* Navigation Menu */}
			<nav className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col">
				<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-md px-space-md pt-space-sm">
					Account Menu
				</h3>
				<div className="flex flex-col">
					{navigationItems.map((item) => (
						<Link
							key={item.id}
							to={item.path}
							className={`group flex items-center justify-between px-space-md py-3 rounded-xl transition-all ${
								isActive(item.path)
									? "bg-primary text-on-primary"
									: "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
							}`}
						>
							<div className="flex items-center gap-space-sm">
								<span
									className={`material-symbols-outlined text-xl ${
										isActive(item.path) ? "text-on-primary" : "text-outline group-hover:text-primary"
									}`}
								>
									{item.icon}
								</span>
								<span className={`font-label-lg text-label-lg font-semibold ${
									isActive(item.path) ? "text-on-primary" : ""
								}`}>{item.label}</span>
							</div>
							{item.badge && (
								<span
									className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold ${
										isActive(item.path)
											? "bg-on-primary text-primary"
											: "bg-error-container text-on-error-container"
									}`}
								>
									{item.badge}
								</span>
							)}
						</Link>
					))}
				</div>
			</nav>
		</aside>
	);
}

export default ProfileSidebar;

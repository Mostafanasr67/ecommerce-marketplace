function ProfileSidebar() {
	const navigationItems = [
		{
			id: "profile",
			label: "My Profile",
			icon: "person",
			path: "profile",
			active: true,
		},
		{
			id: "orders",
			label: "My Orders",
			icon: "shopping_bag",
			path: "orders",
			badge: "3",
		},
		{
			id: "addresses",
			label: "Addresses",
			icon: "location_on",
			path: "addresses",
			badge: "3",
		},
		{
			id: "payments",
			label: "Payment Methods",
			icon: "credit_card",
			path: "payments",
			badge: "3",
		},
		{
			id: "wishlist",
			label: "Wishlist & Saved",
			icon: "favorite",
			path: "wishlist",
			badge: "3",
		},
		{
			id: "communications",
			label: "Communications",
			icon: "notifications",
			path: "communications",
		},
		{
			id: "settings",
			label: "Settings",
			icon: "settings",
			path: "settings",
		},
		{
			id: "help",
			label: "Help & Support",
			icon: "help",
			path: "help",
		},
	];

	return (
		<aside className="flex flex-col gap-space-lg">
			{/* Navigation Menu */}
			<nav className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col">
				<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-md px-space-md pt-space-sm">
					Account Menu
				</h3>
				<div className="flex flex-col">
					{navigationItems.map((item) => (
						<a
							key={item.id}
							href={`#${item.path}`}
							className={`group flex items-center justify-between px-space-md py-3 rounded-xl transition-all ${
								item.active
									? "bg-primary text-on-primary"
									: "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
							}`}
						>
							<div className="flex items-center gap-space-sm">
								<span
									className={`material-symbols-outlined text-xl ${
										item.active ? "text-on-primary" : "text-outline group-hover:text-primary"
									}`}
								>
									{item.icon}
								</span>
								<span className="font-label-lg text-label-lg font-semibold">{item.label}</span>
							</div>
							{item.badge && (
								<span
									className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold ${
										item.active
											? "bg-on-primary text-primary"
											: "bg-error-container text-on-error-container"
									}`}
								>
									{item.badge}
								</span>
							)}
						</a>
					))}
				</div>
			</nav>

			{/* Account Tier Info Card */}
			<div className="bg-gradient-to-br from-primary to-primary-container p-space-md rounded-2xl text-on-primary shadow-sm">
				<div className="flex items-center gap-space-sm mb-space-md">
					<span className="material-symbols-outlined text-2xl">verified</span>
					<span className="font-headline-sm text-headline-sm font-bold">Tier 1 Member</span>
				</div>
				<p className="font-body-sm text-body-sm text-on-primary/90 mb-space-md">
					You have access to exclusive benefits, priority support, and special offers.
				</p>
				<div className="flex items-center justify-between pt-space-md border-t border-on-primary/20">
					<span className="font-label-sm text-label-sm">Member since Nov 2023</span>
					<a
						href="#upgrade"
						className="font-label-sm text-label-sm font-bold hover:underline flex items-center gap-1"
					>
						<span>Learn more</span>
						<span className="material-symbols-outlined text-xs">arrow_forward</span>
					</a>
				</div>
			</div>
		</aside>
	);
}

export default ProfileSidebar;

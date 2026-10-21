import { Link } from "react-router-dom";

type HeaderProps = {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	categoryQuery: string;
	setCategoryQuery: (query: string) => void;
	wishlist: number[];
};

function Header({
	searchQuery,
	setSearchQuery,
	categoryQuery,
	setCategoryQuery,
	wishlist,
}: HeaderProps) {
	return (
		<header>
			{/* Top announcement bar */}
			<div className="h-9 bg-inverse-surface text-inverse-on-surface">
				<div className="mx-auto flex h-full max-w-7xl items-center justify-between px-margin font-label-md text-label-md">
					{/* Left side: store announcements */}
					<div className="flex items-center gap-space-sm">
						<span>
							🚚 Free delivery on orders over 1,500 EGP across Cairo & Giza
						</span>
						<span className="text-outline">|</span>
						<span>🛡️ 100% Genuine Certified Sellers</span>
						<span className="text-outline">|</span>
						<span>24/7 Support: 19855</span>
					</div>

					{/* Right side: seller link and language */}
					<div className="flex shrink-0 items-center gap-space-md">
						<a href="#" className="transition-colors hover:text-primary-fixed">
							Sell on Sovereign
						</a>

						<span className="text-outline">|</span>

						<button
							type="button"
							className="transition-colors hover:text-primary-fixed"
						>
							🌐 العربية
						</button>
					</div>
				</div>
			</div>

			{/* Main navigation row */}
			<div className="border-b border-outline-variant bg-surface-container-lowest">
				<div className="mx-auto flex max-w-7xl items-center gap-space-lg px-margin py-space-md">
					{/* Logo */}
					<Link to="/" className="shrink-0">
						<span className="font-headline-lg font-bold tracking-tight">
							SOVEREIGN
						</span>
						<span className="block text-label-sm text-on-surface-variant">
							THE MARKETPLACE
						</span>
					</Link>

					{/* Delivery location */}
					<button
						type="button"
						className="hidden shrink-0 flex-col items-start border-l border-outline-variant pl-space-md text-left md:flex"
					>
						<span className="text-label-sm text-on-surface-variant">
							Deliver to
						</span>
						<span className="font-label-md">Cairo, Egypt</span>
					</button>

					{/* Search bar */}
					<div className="flex min-w-0 flex-1 items-center rounded-lg bg-surface-container-low px-space-md">
						<span className="mr-space-sm" aria-hidden="true">
							🔍
						</span>
						<input
							type="search"
							placeholder="Search products, brands, and sellers..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full bg-transparent py-space-md text-body-md outline-none"
						/>
						<button
							type="button"
							className="hidden shrink-0 rounded-md bg-primary px-space-lg py-space-sm font-label-md text-on-primary sm:block"
						>
							Search
						</button>
					</div>

					{/* Customer actions */}
					<div className="flex shrink-0 items-center gap-space-md">
						<button type="button" className="relative hidden sm:block">
							<span className="text-xl">♡</span>
							<span className="ml-space-xs text-label-md">Wishlist</span>
							{wishlist.length > 0 && (
								<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-xs font-bold text-on-error">
									{wishlist.length}
								</span>
							)}
						</button>

						<button type="button" className="hidden sm:block">
							👤
							<span className="ml-space-xs text-label-md">Account</span>
						</button>

						<button type="button" className="relative">
							🛒
							<span className="ml-space-xs text-label-md">Cart</span>
						</button>
					</div>
				</div>
			</div>

			{/* Category navigation */}
			<nav className="border-b border-outline-variant bg-surface-container-lowest">
				<div className="mx-auto flex max-w-7xl items-center gap-space-lg overflow-x-auto px-margin py-space-md">
					<a
						href="#"
						className={`shrink-0 font-label-md ${categoryQuery === "" ? "text-primary" : ""}`}
						onClick={() => setCategoryQuery("")}
					>
						All Categories
					</a>

					<a
						href="#"
						className={`shrink-0 text-label-md hover:text-primary ${categoryQuery === "Electronics" ? "text-primary" : ""}`}
						onClick={() => setCategoryQuery("Electronics")}
					>
						Electronics
					</a>

					<a
						href="#"
						className={`shrink-0 text-label-md hover:text-primary ${categoryQuery === "Fashion" ? "text-primary" : ""}`}
						onClick={() => setCategoryQuery("Fashion")}
					>
						Fashion
					</a>

					<a
						href="#"
						className={`shrink-0 text-label-md hover:text-primary ${categoryQuery === "Home & Living" ? "text-primary" : ""}`}
						onClick={() => setCategoryQuery("Home & Living")}
					>
						Home & Living
					</a>

					<a
						href="#"
						className={`shrink-0 text-label-md hover:text-primary ${categoryQuery === "Beauty & Personal Care" ? "text-primary" : ""}`}
						onClick={() => setCategoryQuery("Beauty & Personal Care")}
					>
						Beauty & Personal Care
					</a>

					<a
						href="#"
						className={`shrink-0 text-label-md hover:text-primary ${categoryQuery === "Sports & Outdoors" ? "text-primary" : ""}`}
						onClick={() => setCategoryQuery("Sports & Outdoors")}
					>
						Sports & Outdoors
					</a>

					<a
						href="#"
						className={`shrink-0 text-label-md hover:text-primary ${categoryQuery === "Automotive" ? "text-primary" : ""}`}
						onClick={() => setCategoryQuery("Automotive")}
					>
						Automotive
					</a>

					<a
						href="#"
						className={`shrink-0 text-label-md hover:text-primary ${categoryQuery === "Deals" ? "text-primary" : ""}`}
						onClick={() => setCategoryQuery("Deals")}
					>
						Deals
					</a>
				</div>
			</nav>
		</header>
	);
}

export default Header;

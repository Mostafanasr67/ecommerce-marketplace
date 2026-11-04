import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type HeaderProps = {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	categoryQuery: string;
	setCategoryQuery: (query: string) => void;
	wishlist: string[];
	cartCount: number;
};

type category = {
	id: string;
	name: string;
};

function Header({
	searchQuery,
	setSearchQuery,
	categoryQuery,
	setCategoryQuery,
	wishlist,
	cartCount,
}: HeaderProps) {
	const [categories, setCategories] = useState<category[]>([]);

	useEffect(() => {
		fetch("http://localhost:5000/categories")
			.then((res) => res.json())
			.then((data) => {
				// Handle both array and object responses
				const categoryList = Array.isArray(data) ? data : data.categories || [];
				setCategories(categoryList);
			});
	}, []);

	return (
		<header>
			{/* Top announcement bar */}
			<div className="h-9 bg-inverse-surface text-inverse-on-surface">
				<div className="mx-auto flex h-full max-w-7xl items-center justify-between px-margin font-label-md text-label-md">
					{/* Left side: store announcements */}
					<div className="flex items-center gap-space-sm">
						<span>
							🚚 Free delivery on orders over 2000 EGP across Cairo & Giza
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

					{/* Search bar */}
					<div className="flex min-w-0 flex-1 items-center rounded-lg bg-surface-container-low px-space-md">
						<span className="material-symbols-outlined mr-space-sm text-on-surface-variant">search</span>
						<input
							type="search"
							placeholder="Search products, brands, and sellers..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full bg-transparent py-space-md text-body-md outline-none"
						/>
						<button
							type="button"
							className="hidden shrink-0 ml-space-sm text-on-surface-variant hover:text-primary transition-colors sm:flex sm:items-center sm:justify-center"
							title="Search"
						>
							<span className="material-symbols-outlined text-xl">arrow_forward</span>
						</button>
					</div>

					{/* Customer actions */}
					<div className="flex shrink-0 items-center gap-space-md">
						<button type="button" className="relative hidden sm:flex sm:items-center sm:gap-1">
							<span className="material-symbols-outlined text-xl">favorite</span>
							<span className="text-label-md">Wishlist</span>
							{wishlist.length > 0 && (
								<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-xs font-bold text-on-error">
									{wishlist.length}
								</span>
							)}
						</button>

						<button type="button" className="hidden sm:flex sm:items-center sm:gap-1">
							<span className="material-symbols-outlined text-xl">person</span>
							<span className="text-label-md">Account</span>
						</button>

						<Link to="/cart" className="relative flex items-center gap-1">
							<span className="material-symbols-outlined text-xl">shopping_bag</span>
							<span className="text-label-md">Cart</span>
							{cartCount > 0 && (
								<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-xs font-bold text-on-error">
									{cartCount}
								</span>
							)}
						</Link>
					</div>
				</div>
			</div>

			{/* Category navigation */}
			<nav className="border-b border-outline-variant bg-surface-container-lowest">
				<div className="mx-auto flex max-w-7xl items-center gap-space-lg overflow-x-auto px-margin py-space-md">
					<Link
						to="#featured-catalog"
						className={`shrink-0 text-title-sm ${
							categoryQuery === ""
								? "text-primary font-bold text-lg"
								: "hover:text-primary"
						}`}
						onClick={(e) => {
							e.preventDefault();
							setCategoryQuery("");
							setTimeout(() => {
								document
									.getElementById("featured-catalog")
									?.scrollIntoView({ behavior: "smooth" });
							}, 100);
						}}
					>
						All Categories
					</Link>

					{categories.map((category) => (
						<Link
							key={category.id}
							to="#featured-catalog"
							className={`shrink-0 text-title-sm ${
								categoryQuery === category.id
									? "text-primary font-bold text-lg"
									: "hover:text-primary"
							}`}
							onClick={(e) => {
								e.preventDefault();
								setCategoryQuery(category.id);
								setTimeout(() => {
									document
										.getElementById("featured-catalog")
										?.scrollIntoView({ behavior: "smooth" });
								}, 100);
							}}
						>
							{category.name}{" "}
						</Link>
					))}
					<Link
						to="#featured-catalog"
						className={`shrink-0 text-title-sm ${
							categoryQuery === "Deals"
								? "text-primary font-bold text-lg"
								: "hover:text-primary"
						}`}
						onClick={(e) => {
							e.preventDefault();
							setCategoryQuery("Deals");
							setTimeout(() => {
								document
									.getElementById("featured-catalog")
									?.scrollIntoView({ behavior: "smooth" });
							}, 100);
						}}
					>
						Deals
					</Link>
				</div>
			</nav>
		</header>
	);
}

export default Header;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type HeaderProps = {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	categoryQuery: string;
	onCategorySelect: (categoryId: string) => void;
	wishlist: string[];
	cartCount: number;
	onLogout: () => void;
};

type category = {
	id: string;
	name: string;
};

function Header({
	searchQuery,
	setSearchQuery,
	categoryQuery,
	onCategorySelect,
	wishlist,
	cartCount,
	onLogout,
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
			{/* Main navigation row */}
			<div className="border-b border-outline-variant bg-surface-container-lowest">
				<div className="mx-auto flex max-w-7xl items-center gap-space-lg px-margin py-space-md">
					{/* Logo */}
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
						<Link to="/wishlist" type="button" className="relative hidden sm:flex sm:items-center sm:gap-1">
							<span className="material-symbols-outlined text-xl">favorite</span>
							<span className="text-label-md">Wishlist</span>
							{wishlist.length > 0 && (
								<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-xs font-bold text-on-error">
									{wishlist.length}
								</span>
							)}
						</Link>

						<Link to="/profile" className="hidden sm:flex sm:items-center sm:gap-1">
							<span className="material-symbols-outlined text-xl">person</span>
							<span className="text-label-md">Profile</span>
						</Link>

						<Link to="/cart" className="relative flex items-center gap-1">
							<span className="material-symbols-outlined text-xl">shopping_bag</span>
							<span className="text-label-md">Cart</span>
							{cartCount > 0 && (
								<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-xs font-bold text-on-error">
									{cartCount}
								</span>
							)}
						</Link>

						<button
							type="button"
							onClick={onLogout}
							className="flex items-center gap-1"
						>
							<span className="material-symbols-outlined text-xl">logout</span>
							<span className="text-label-md">Logout</span>
						</button>
					</div>
				</div>
			</div>

			{/* Category navigation */}
			<nav className="border-b border-outline-variant bg-surface-container-lowest">
				<div className="mx-auto flex max-w-7xl items-center gap-space-lg overflow-x-auto px-margin py-space-md">
					<Link
						to="/products"
						className={`shrink-0 text-title-sm ${
							categoryQuery === ""
								? "text-primary font-bold text-lg"
								: "hover:text-primary"
						}`}
						onClick={(e) => {
							e.preventDefault();
							onCategorySelect("");
						}}
					>
						All Categories
					</Link>

					{categories.map((category) => (
						<Link
							key={category.id}
							to="/products"
							className={`shrink-0 text-title-sm ${
								categoryQuery === category.id
									? "text-primary font-bold text-lg"
									: "hover:text-primary"
							}`}
							onClick={(e) => {
								e.preventDefault();
								onCategorySelect(category.id);
							}}
						>
							{category.name}{" "}
						</Link>
					))}
					<Link
						to="/products"
						className={`shrink-0 text-title-sm ${
							categoryQuery === "Deals"
								? "text-primary font-bold text-lg"
								: "hover:text-primary"
						}`}
						onClick={(e) => {
							e.preventDefault();
							onCategorySelect("Deals");
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

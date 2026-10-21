import ProductCard from "./ProductCard";

const recentProducts = [
	{
		id: 1,
		name: "Premium Everyday Backpack",
		image:
			"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
		price: 1599,
		rating: 4.7,
		seller: "Urban Carry",
		badge: "Just Added",
	},
	{
		id: 2,
		name: "Minimal Ceramic Coffee Set",
		image:
			"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80",
		price: 749,
		rating: 4.6,
		seller: "Cairo Crafts",
		badge: "New Arrival",
	},
	{
		id: 3,
		name: "Wireless Portable Speaker",
		image:
			"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
		price: 2199,
		oldPrice: 2699,
		rating: 4.8,
		seller: "Tech Haven",
		badge: "Just Added",
	},
	{
		id: 4,
		name: "Classic Leather Wallet",
		image:
			"https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
		price: 599,
		rating: 4.5,
		seller: "Leather House",
		badge: "New Arrival",
	},
];

type RecentlyAddedProps = {
	wishlist: number[];
	toggleWishlist: (productId: number) => void;
};

function RecentlyAdded({ wishlist, toggleWishlist }: RecentlyAddedProps) {
	return (
		<section className="mx-auto w-full max-w-7xl px-margin py-space-xl">
			<div className="mb-space-lg flex items-end justify-between gap-space-md">
				<div>
					<p className="mb-space-xs text-label-sm font-bold uppercase tracking-wider text-primary">
						Fresh finds
					</p>

					<h2 className="text-headline-md font-bold text-on-surface">
						Recently Added
					</h2>

					<p className="mt-space-sm text-body-md text-on-surface-variant">
						Explore the latest products from our sellers.
					</p>
				</div>

				<a
					href="#"
					className="shrink-0 text-label-md font-semibold text-primary hover:underline"
				>
					View all →
				</a>
			</div>

			<div className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
				{recentProducts.map((product) => (
					<ProductCard
						key={product.id}
						{...product}
						wishlist={wishlist}
						toggleWishlist={toggleWishlist}
					/>
				))}
			</div>
		</section>
	);
}

export default RecentlyAdded;

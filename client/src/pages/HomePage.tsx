import Hero from "../components/homepage/Hero";
import Categories from "../components/homepage/Categories";
import FeaturedProducts from "../components/products/FeaturedProducts";
import RecentlyAdded from "../components/homepage/RecentlyAdded";

function HomePage({
	searchQuery,
	categoryQuery,
	wishlist,
	toggleWishlist,
	setCategoryQuery,
}: {
	searchQuery: string;
	categoryQuery: string;
	wishlist: string[];
	toggleWishlist: (productId: string) => void;
	setCategoryQuery: (category: string) => void;
}) {
	return (
		<main className="min-h-screen bg-surface">
							<Hero />
							<Categories setCategoryQuery={setCategoryQuery} />
							<FeaturedProducts
								searchQuery={searchQuery}
								categoryQuery={categoryQuery}
								wishlist={wishlist}
								toggleWishlist={toggleWishlist}
							/>
							<RecentlyAdded
								wishlist={wishlist}
								toggleWishlist={toggleWishlist}
							/>
						</main>
	);
}

export default HomePage;
import Hero from "../components/homepage/Hero";
import Benefits from "../components/homepage/Benefits";
import Categories from "../components/homepage/Categories";
import FeaturedProducts from "../components/products/FeaturedProducts";
import RecentlyAdded from "../components/homepage/RecentlyAdded";
import BuyerProtection from "../components/homepage/BuyerProtection";

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
							<Benefits />
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
							<BuyerProtection />
						</main>
	);
}

export default HomePage;
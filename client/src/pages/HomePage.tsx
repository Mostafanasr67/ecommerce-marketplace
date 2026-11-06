import Hero from "../components/user/homepage/Hero";
import Categories from "../components/user/homepage/Categories";
import FeaturedProducts from "../components/user/products/FeaturedProducts";
import RecentlyAdded from "../components/user/homepage/RecentlyAdded";

function HomePage({
	searchQuery,
	categoryQuery,
	wishlist,
	toggleWishlist,
	onCategorySelect,
}: {
	searchQuery: string;
	categoryQuery: string;
	wishlist: string[];
	toggleWishlist: (productId: string) => void;
	onCategorySelect: (categoryId: string) => void;
}) {
	return (
		<main className="min-h-screen bg-surface">
							<Hero />
							<Categories onCategorySelect={onCategorySelect} />
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
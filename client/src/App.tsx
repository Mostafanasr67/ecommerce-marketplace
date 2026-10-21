import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import TopSellers from "./components/TopSellers";
import RecentlyAdded from "./components/RecentlyAdded";
import BuyerProtection from "./components/BuyerProtection";

function App() {
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryQuery, setCategoryQuery] = useState("");
	const [wishlist, setWishlist] = useState<number[]>([]);

	function toggleWishlist(productId: number) {
		setWishlist((currentWishlist) =>
			currentWishlist.includes(productId)
				? currentWishlist.filter((id) => id !== productId)
				: [...currentWishlist, productId],
		);
	}

	return (
		<>
			<Header
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				categoryQuery={categoryQuery}
				setCategoryQuery={setCategoryQuery}
				wishlist={wishlist}
			/>
			<main className="min-h-screen bg-surface">
				<Hero />
				<Benefits />
				<Categories />
				<FeaturedProducts
					searchQuery={searchQuery}
					categoryQuery={categoryQuery}
					wishlist={wishlist}
					toggleWishlist={toggleWishlist}
				/>
				<TopSellers />
				<RecentlyAdded wishlist={wishlist} toggleWishlist={toggleWishlist} />
				<BuyerProtection />
				<Footer />
			</main>
		</>
	);
}

export default App;

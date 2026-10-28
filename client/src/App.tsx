import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import TopSellers from "./components/TopSellers";
import RecentlyAdded from "./components/RecentlyAdded";
import BuyerProtection from "./components/BuyerProtection";
import ProductDetails from "./components/ProductDetails";
import CartPage from "./components/CartPage";

function App() {
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryQuery, setCategoryQuery] = useState("");
	const [wishlist, setWishlist] = useState<string[]>([]);

	function toggleWishlist(productId: string) {
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

			<Routes>
				<Route
					path="/"
					element={
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
							<TopSellers />
							<RecentlyAdded
								wishlist={wishlist}
								toggleWishlist={toggleWishlist}
							/>
							<BuyerProtection />
						</main>
					}
				/>

				<Route
					path="/products"
					element={
						<main className="min-h-screen bg-surface">
							<FeaturedProducts
								searchQuery={searchQuery}
								categoryQuery={categoryQuery}
								wishlist={wishlist}
								toggleWishlist={toggleWishlist}
							/>
						</main>
					}
				/>

				<Route
					path="/products/:id"
					element={
						<ProductDetails
							wishlist={wishlist}
							toggleWishlist={toggleWishlist}
						/>
					}
				/>

				<Route path="/cart" element={<CartPage wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
			</Routes>

			<Footer />
		</>
	);
}

export default App;

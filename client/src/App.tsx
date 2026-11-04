import { useState } from "react";
import type { Address } from "./components/address/AddressHelper";
import { Routes, Route } from "react-router-dom";

import Header from "./components/general/Header";
import Footer from "./components/general/Footer";
import FeaturedProducts from "./components/products/FeaturedProducts";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import { fetchCartItems } from "./components/cart/CartHelper";
import { useQuery } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import AllOrdersPage from "./pages/AllOrdersPage";

function App() {
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryQuery, setCategoryQuery] = useState("");
	const [wishlist, setWishlist] = useState<string[]>([]);
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [paymentMethod, setPaymentMethod] = useState("ONLINE");

	const cartQuery = useQuery({
		queryKey: ["cart"],
		queryFn: fetchCartItems,
	});

	const cartCount =
		cartQuery.data?.reduce((count, item) => count + item.quantity, 0) ?? 0;

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
				cartCount={cartCount}
			/>

			<Routes>
				<Route
					path="/"
					element={
						<HomePage
							searchQuery={searchQuery}
							categoryQuery={categoryQuery}
							wishlist={wishlist}
							toggleWishlist={toggleWishlist}
							setCategoryQuery={setCategoryQuery}
						/>
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
				<Route
					path="/cart"
					element={
						<CartPage wishlist={wishlist} toggleWishlist={toggleWishlist} />
					}
				/>
				<Route
					path="/address"
					element={<AddressPage selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />}
				/>
				<Route
					path="/payment"
					element={<PaymentPage selectedAddress={selectedAddress} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />}
				/>
				<Route
					path="/place-order"
					element={<OrderPage />}
				/>
				<Route
					path="/profile"
					element={<ProfilePage />}
				/>
				<Route
					path="/all-orders"
					element={<AllOrdersPage />}
				/>
			</Routes>

			<Footer />
		</>
	);
}

export default App;

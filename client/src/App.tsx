import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Address } from "./components/address/AddressHelper";
import { Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Header from "./components/general/Header";
import Footer from "./components/general/Footer";
import FeaturedProducts from "./components/products/FeaturedProducts";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import { fetchCartItems } from "./components/cart/CartHelper";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "./components/product/ProductHelper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import AllOrdersPage from "./pages/AllOrdersPage";
import LoginPage from "./pages/LoginPage";
import WishlistPage from "./pages/WishlistPage";

function App() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryQuery, setCategoryQuery] = useState("");
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [paymentMethod, setPaymentMethod] = useState("ONLINE");
	const queryClient = useQueryClient();
	const isAuthenticated = Boolean(localStorage.getItem("token"));

	useEffect(() => {
		const token = searchParams.get("token");
		const userJson = searchParams.get("user");

		if (token) {
			queryClient.clear();
			localStorage.setItem("token", token);
			if (userJson) {
				try {
					const user = JSON.parse(userJson);
					localStorage.setItem("user", JSON.stringify(user));
				} catch (error) {
					console.error("Failed to parse user data:", error);
				}
			}
			navigate("/home", { replace: true });
		}
	}, [navigate, queryClient, searchParams]);

	const location = useLocation();

	const cartQuery = useQuery({
		queryKey: ["cart"],
		queryFn: fetchCartItems,
		enabled: isAuthenticated,
	});

	const wishlistQuery = useQuery({
		queryKey: ["wishlist"],
		queryFn: fetchWishlist,
		enabled: isAuthenticated,
	});

	const cartCount =
		cartQuery.data?.reduce((count, item) => count + item.quantity, 0) ?? 0;

	const wishlist = wishlistQuery.data?.map((p) => p.id) ?? [];

	const isLoginPage = location.pathname === "/" && !isAuthenticated;
	const authenticatedPage = (element: ReactNode) =>
		isAuthenticated ? element : <Navigate to="/" replace />;

	function handleLogout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setSelectedAddress(null);
		setPaymentMethod("ONLINE");
		queryClient.clear();
		navigate("/", { replace: true });
	}

	function handleCategorySelect(categoryId: string) {
		setCategoryQuery(categoryId);
		if (location.pathname === "/home") {
			window.setTimeout(() => {
				document
					.getElementById("featured-catalog")
					?.scrollIntoView({ behavior: "smooth" });
			}, 0);
			return;
		}
		navigate("/products");
	}

	async function toggleWishlist(productId: string) {
		try {
			if (wishlist.includes(productId)) {
				await removeFromWishlist(productId);
			} else {
				await addToWishlist(productId);
			}
			queryClient.invalidateQueries({ queryKey: ["wishlist"] });
		} catch (error) {
			console.error("Failed to toggle wishlist:", error);
		}
	}

	return (
		<>
			{isAuthenticated && !isLoginPage && (
				<Header
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					categoryQuery={categoryQuery}
					onCategorySelect={handleCategorySelect}
					wishlist={wishlist}
					cartCount={cartCount}
					onLogout={handleLogout}
				/>
			)}

			<Routes>
				<Route
					path="/"
					element={
						isAuthenticated
							? <Navigate to="/home" replace />
							: <LoginPage />
					}
				/>
				<Route
					path="/home"
					element={authenticatedPage(
						<HomePage
							searchQuery={searchQuery}
							categoryQuery={categoryQuery}
							wishlist={wishlist}
							toggleWishlist={toggleWishlist}
							onCategorySelect={handleCategorySelect}
						/>
					)}
				/>
				<Route
					path="/products"
					element={authenticatedPage(
						<main className="min-h-screen bg-surface">
							<FeaturedProducts
								searchQuery={searchQuery}
								categoryQuery={categoryQuery}
								wishlist={wishlist}
								toggleWishlist={toggleWishlist}
							/>
						</main>
					)}
				/>
				<Route
					path="/products/:id"
					element={authenticatedPage(
						<ProductDetails
							wishlist={wishlist}
							toggleWishlist={toggleWishlist}
						/>
					)}
				/>
				<Route
					path="/cart"
					element={authenticatedPage(
						<CartPage wishlist={wishlist} toggleWishlist={toggleWishlist} />,
					)}
				/>
				<Route
					path="/address"
					element={authenticatedPage(
						<AddressPage selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />,
					)}
				/>
				<Route
					path="/payment"
					element={authenticatedPage(
						<PaymentPage selectedAddress={selectedAddress} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />,
					)}
				/>
				<Route
					path="/place-order"
					element={authenticatedPage(<OrderPage />)}
				/>
				<Route
					path="/profile"
					element={authenticatedPage(<ProfilePage wishlist={wishlist} />)}
				/>
				<Route
					path="/orders"
					element={authenticatedPage(<AllOrdersPage wishlist={wishlist} />)}
				/>
				<Route
					path="/wishlist"
					element={authenticatedPage(
						<WishlistPage wishlist={wishlist} toggleWishlist={toggleWishlist} />,
					)}
				/>
				<Route
					path="*"
					element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />}
				/>
			</Routes>

			{isAuthenticated && !isLoginPage && <Footer />}
		</>
	);
}

export default App;

import { useState, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { Address } from "./components/user/address/AddressHelper";
import { Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Header from "./components/user/general/Header";
import Footer from "./components/user/general/Footer";
import FeaturedProducts from "./components/user/products/FeaturedProducts";
import ProductDetails from "./pages/user/ProductDetails";
import CartPage from "./pages/user/CartPage";
import { fetchCartItems } from "./components/user/cart/CartHelper";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "./components/user/product/ProductHelper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import HomePage from "./pages/user/HomePage";
import AddressPage from "./pages/user/AddressPage";
import PaymentPage from "./pages/user/PaymentPage";
import OrderPage from "./pages/user/OrderPage";
import ProfilePage from "./pages/user/ProfilePage";
import AllOrdersPage from "./pages/user/AllOrdersPage";
import LoginPage from "./pages/user/LoginPage";
import WishlistPage from "./pages/user/WishlistPage";
import SellerDashboard from "./pages/seller/SellerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { Role } from "../../server/generated/prisma/enums";
import { getAccessRedirect, getRoleHomePath } from "./utils/routeAccess";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage.tsx";
import SellerProductsPage from "./pages/seller/SellerProductsPage";
import SellerStoreSettingsPage from "./pages/seller/SellerStoreSettingsPage";
import { CheckoutCouponProvider } from "./components/user/cart/CheckoutCoupon";
import AdminLayout from "./components/admin/AdminLayout";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSellersPage from "./pages/admin/AdminSellersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";

function subscribeToTokenChange(callback: () => void) {
	window.addEventListener("storage", callback);
	window.addEventListener("session-token-change", callback);
	return () => {
		window.removeEventListener("storage", callback);
		window.removeEventListener("session-token-change", callback);
	};
}

function getStoredToken() {
	return localStorage.getItem("token");
}

function App() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryQuery, setCategoryQuery] = useState("");
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [paymentMethod, setPaymentMethod] = useState("ONLINE");
	const queryClient = useQueryClient();
	const token = useSyncExternalStore(subscribeToTokenChange, getStoredToken);
	const sessionQuery = useQuery({
		queryKey: ["session", token],
		queryFn: async () => {
			const response = await fetch("http://localhost:5000/auth/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (response.status === 401) throw new Error("Your session has expired or is invalid. Please log in again.");
			if (!response.ok) throw new Error(`Could not verify your session (${response.status}). Please try again.`);
			const user: unknown = await response.json();
			if (
				typeof user !== "object" || user === null || !("id" in user) ||
				typeof user.id !== "string" || !("role" in user) ||
				(user.role !== Role.USER && user.role !== Role.SELLER && user.role !== Role.ADMIN)
			) {
				throw new Error("The server returned an invalid session.");
			}
			if (localStorage.getItem("token") !== token) throw new Error("Your session changed. Please try again.");
			localStorage.setItem("user", JSON.stringify(user));
			return { id: user.id, role: user.role };
		},
		enabled: Boolean(token) && !searchParams.get("token"),
		retry: false,
		staleTime: 0,
	});
	const isAuthenticated = Boolean(token && sessionQuery.data);
	const role = sessionQuery.data?.role ?? null;
	const homePath = role ? getRoleHomePath(role) : "/";

	useEffect(() => {
		const token = searchParams.get("token");
		if (token) {
			queryClient.clear();
			localStorage.setItem("token", token);
			localStorage.removeItem("user");
			window.dispatchEvent(new Event("session-token-change"));
			navigate(location.pathname, { replace: true });
		}
	}, [location.pathname, navigate, queryClient, searchParams]);

	useEffect(() => {
		const clearChangedSession = (event: StorageEvent) => {
			if (event.key === "token" || event.key === null) queryClient.clear();
		};
		window.addEventListener("storage", clearChangedSession);
		return () => window.removeEventListener("storage", clearChangedSession);
	}, [queryClient]);

	const cartQuery = useQuery({
		queryKey: ["cart"],
		queryFn: fetchCartItems,
		enabled: isAuthenticated && role === Role.USER,
	});

	const wishlistQuery = useQuery({
		queryKey: ["wishlist"],
		queryFn: fetchWishlist,
		enabled: isAuthenticated && role === Role.USER,
	});

	const cartCount =
		cartQuery.data?.reduce((count, item) => count + item.quantity, 0) ?? 0;

	const wishlist = wishlistQuery.data?.map((p) => p.id) ?? [];

	const isLoginPage = location.pathname === "/" && !isAuthenticated;
	const authorizedPage = (requiredRole: Role, element: ReactNode) => {
		const redirect = getAccessRedirect(role, requiredRole);
		return redirect ? <Navigate to={redirect} replace /> : element;
	};
	const isDashboard = location.pathname.startsWith("/seller-dashboard") || location.pathname.startsWith("/admin-");

	function handleLogout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.dispatchEvent(new Event("session-token-change"));
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

	if (searchParams.get("token")) {
		return null;
	}

	if (token && sessionQuery.isPending) {
		return <main className="p-space-lg"><p>Verifying your session...</p></main>;
	}

	if (token && sessionQuery.isError) {
		return (
			<main className="p-space-lg">
				<p role="alert">{sessionQuery.error.message}</p>
				<button type="button" onClick={() => void sessionQuery.refetch()} className="mt-space-md mr-space-md cursor-pointer text-primary underline">
					Try again
				</button>
				<button type="button" onClick={handleLogout} className="mt-space-md cursor-pointer text-primary underline">
					Log out
				</button>
			</main>
		);
	}

	return (
		<>
			{isAuthenticated && !isLoginPage && !isDashboard && role == Role.USER && (
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

			<CheckoutCouponProvider key={token ?? "guest"}>
			<Routes>
				<Route
					path="/"
					element={
						isAuthenticated
							? <Navigate to={homePath} replace />
							: <LoginPage />
					}
				/>
				<Route
					path="/home"
					element={authorizedPage(Role.USER,
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
					element={authorizedPage(Role.USER,
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
					element={authorizedPage(Role.USER,
						<ProductDetails
							wishlist={wishlist}
							toggleWishlist={toggleWishlist}
						/>
					)}
				/>
				<Route
					path="/cart"
					element={authorizedPage(Role.USER,
						<CartPage wishlist={wishlist} toggleWishlist={toggleWishlist} />,
					)}
				/>
				<Route
					path="/address"
					element={authorizedPage(Role.USER,
						<AddressPage selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />,
					)}
				/>
				<Route
					path="/payment"
					element={authorizedPage(Role.USER,
						<PaymentPage selectedAddress={selectedAddress} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />,
					)}
				/>
				<Route
					path="/place-order"
					element={authorizedPage(Role.USER, <OrderPage />)}
				/>
				<Route
					path="/profile"
					element={authorizedPage(Role.USER, <ProfilePage wishlist={wishlist} />)}
				/>
				<Route
					path="/orders"
					element={authorizedPage(Role.USER, <AllOrdersPage wishlist={wishlist} />)}
				/>
				<Route
					path="/wishlist"
					element={authorizedPage(Role.USER,
						<WishlistPage wishlist={wishlist} toggleWishlist={toggleWishlist} />,
					)}
				/>
				<Route
					path="*"
					element={<Navigate to={isAuthenticated ? homePath : "/"} replace />}
				/>
				<Route
					path="/seller-dashboard"
					element={authorizedPage(Role.SELLER, <SellerDashboard onLogout={handleLogout} />)}
				/>
				<Route
					path="/seller-orders"
					element={authorizedPage(Role.SELLER, <SellerOrdersPage onLogout={handleLogout} />)}
				/>
				<Route
					path="/seller-products"
					element={authorizedPage(Role.SELLER, <SellerProductsPage onLogout={handleLogout} />)}
				/>
				<Route
					path="/store-settings"
					element={authorizedPage(Role.SELLER, <SellerStoreSettingsPage onLogout={handleLogout} />)}
				/>
				<Route element={authorizedPage(Role.ADMIN, <AdminLayout onLogout={handleLogout} />)}>
					<Route path="/admin-dashboard" element={<AdminDashboard />} />
					<Route path="/admin-users" element={<AdminUsersPage />} />
					<Route path="/admin-sellers" element={<AdminSellersPage />} />
					<Route path="/admin-products" element={<AdminProductsPage />} />
					<Route path="/admin-categories" element={<AdminCategoriesPage />} />
					<Route path="/admin-orders" element={<AdminOrdersPage />} />
				</Route>
			</Routes>
			</CheckoutCouponProvider>

			{isAuthenticated && !isLoginPage && !isDashboard && role == Role.USER && <Footer />}
		</>
	);
}

export default App;

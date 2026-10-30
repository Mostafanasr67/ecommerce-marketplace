import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartPackages from "../data/cart";
import CartControls from "../components/cart/CartControls";
import CartPackage from "../components/cart/CartPackage";
import CheckoutProgress from "../components/cart/CheckoutProgress";
import CartRecommendations from "../components/cart/CartRecommendations";
import OrderSummary from "../components/cart/OrderSummary";
import CartHeader from "../components/cart/CartHeader";
import {
	fetchCartItems,
	updateCartItemQuantity,
	removeCartItem,
} from "../components/cart/CartHelper";

function CartPage({
	wishlist,
	toggleWishlist,
}: {
	wishlist: string[];
	toggleWishlist: (productId: string) => void;
}) {
	const queryClient = useQueryClient();
	const cartQuery = useQuery({
		queryKey: ["cart"],
		queryFn: fetchCartItems,
	});
	const items = useMemo(() => cartQuery.data ?? [], [cartQuery.data]);

	const updateQuantityMutation = useMutation({
		mutationFn: ({
			productId,
			quantity,
		}: {
			productId: string;
			quantity: number;
		}) => updateCartItemQuantity(productId, quantity),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
	});

	const removeItemMutation = useMutation({
		mutationFn: (productId: string) => removeCartItem(productId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
	});

	const subtotal = items.reduce(
		(total, item) => total + item.product.price * item.quantity,
		0,
	);

	const savings = items.reduce(
		(total, item) =>
			total +
			(item.originalPrice ? item.originalPrice - item.product.price : 0) *
				item.quantity,
		0,
	);

	const itemCount = items.reduce((count, item) => count + item.quantity, 0);

	function updateQuantity(id: string, quantity: number) {
		const item = items.find((currentItem) => currentItem.id === id);
		if (!item) return;
		updateQuantityMutation.mutate({ productId: item.productId, quantity });
	}

	function removeItem(id: string) {
		const item = items.find((currentItem) => currentItem.id === id);
		if (!item) return;
		removeItemMutation.mutate(item.productId);
	}

	const packages = cartPackages
		.map((packageData) => ({
			...packageData,
			items: items.filter((item) => item.packageId === packageData.id),
		}))
		.filter((packageData) => packageData.items.length > 0);

	return (
		<main className="min-h-screen bg-surface">
			<div className="mx-auto w-full max-w-7xl px-margin py-space-xl">
				<CheckoutProgress />
				<CartHeader />

				{cartQuery.isError && (
					<p role="alert" className="mb-space-md text-body-md text-error">
						{cartQuery.error.message}
					</p>
				)}

				<div className="grid grid-cols-12 items-start gap-space-lg">
					<section className="col-span-12 flex flex-col gap-space-lg lg:col-span-8">
						<CartControls subtotal={subtotal} />

						{packages.length > 0 ? (
							packages.map((packageData) => (
								<CartPackage
									key={packageData.id}
									packageData={packageData}
									onQuantityChange={updateQuantity}
									onRemove={removeItem}
									wishlist={wishlist}
									toggleWishlist={toggleWishlist}
								/>
							))
						) : (
							<div className="rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
								<h2 className="text-headline-md font-bold text-on-surface">
									Your cart is empty
								</h2>
								<p className="mt-space-sm text-body-md text-on-surface-variant">
									Add something special from the marketplace to get started.
								</p>
							</div>
						)}

						{items?.length > 0 && <CartRecommendations />}
					</section>

					<div className="col-span-12 flex flex-col gap-space-lg lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
						<OrderSummary
							itemCount={itemCount}
							subtotal={subtotal}
							savings={savings}
							delivery={items.length > 0 ? 35 : 0}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}

export default CartPage;

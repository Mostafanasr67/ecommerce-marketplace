import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../order/OrderHelper";
import type { Address } from "../address/AddressHelper";
import type { SavedCard } from "../payment/CardHelper";

type OrderSummaryProps = {
	itemCount: number;
	subtotal: number;
	savings: number;
	delivery: number;
	selectedAddress?: Address | null;
	paymentMethod?: string;
	selectedCard?: SavedCard | null;
};

const COUPONS = new Map<string, number>([["WELCOME50", 0.5]]);

const CHECKOUT_STEPS: Record<string, { to: string; label: string }> = {
	"/cart": { to: "/address", label: "Proceed to Address" },
	"/address": { to: "/payment", label: "Proceed to Payment" },
};

function OrderSummary({
	itemCount,
	subtotal,
	savings,
	delivery,
	selectedAddress = null,
	paymentMethod,
	selectedCard = null,
}: OrderSummaryProps) {
	const [couponInput, setCouponInput] = useState("");
	const [appliedCode, setAppliedCode] = useState<string | null>(null);
	const [couponError, setCouponError] = useState("");
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const placeOrderMutation = useMutation({
		mutationFn: createOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			navigate("/place-order");
		},
	});
	const checkoutStep = CHECKOUT_STEPS[pathname] ?? {
		to: "/address",
		label: "Proceed to Address",
	};
	const isPaymentStep = pathname === "/payment";
	const checkoutButtonClass =
		"flex w-full items-center justify-center gap-space-sm rounded-xl bg-primary py-3.5 font-bold shadow-md transition-colors hover:bg-primary-container";

	const discountRate = appliedCode ? (COUPONS.get(appliedCode) ?? 0) : 0;
	const couponDiscount = Math.round(subtotal * discountRate);
	const isFreeDelivery = subtotal >= 2000;
	const total =
		subtotal - savings - couponDiscount + (isFreeDelivery ? 0 : delivery);

	function handlePlaceOrder() {
		if (!selectedAddress) return;
		const method = paymentMethod === "COD" || paymentMethod === "cod" ? "COD" : "ONLINE";
		placeOrderMutation.mutate({
			addressId: selectedAddress.id,
			paymentMethod: method,
			cardId: method === "ONLINE" && selectedCard ? selectedCard.id : undefined,
		});
	}

	function applyCoupon() {
		const code = couponInput.trim().toUpperCase();
		if (!code) {
			setAppliedCode(null);
			setCouponError("Please enter a code.");
			return;
		}
		if (!COUPONS.has(code)) {
			setAppliedCode(null);
			setCouponError("Invalid coupon code.");
			return;
		}
		setAppliedCode(code);
		setCouponError("");
	}

	return (
		<aside className="flex flex-col gap-space-lg">
			<section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-md">
				<div className="flex items-center justify-between pb-space-xs">
					<h2 className="text-headline-sm font-extrabold text-on-surface">
						Order Summary
					</h2>{" "}
				</div>

				<div className="flex flex-col gap-space-sm text-body-sm text-on-surface-variant">
					<div className="flex items-center justify-between">
						<span>Subtotal ({itemCount} items)</span>
						<span className="font-semibold text-on-surface">
							{subtotal.toLocaleString("en-EG")} EGP
						</span>
					</div>
					<div className="flex items-center justify-between text-tertiary">
						<span>Vendor Promotional Savings</span>
						<span className="font-bold">
							{savings > 0
								? `-${savings.toLocaleString("en-EG")} EGP`
								: `0 EGP`}
						</span>
					</div>
					{appliedCode && (
						<div className="flex items-center justify-between text-tertiary">
							<span>
								Coupon {appliedCode} ({discountRate * 100}% off)
							</span>
							<span className="font-bold">
								-{couponDiscount.toLocaleString("en-EG")} EGP
							</span>
						</div>
					)}
					<div className="flex items-center justify-between">
						<span> Delivery</span>
						<span className="font-semibold text-on-surface">
							{subtotal > 2000 && (
								<span className="mr-space-xs font-normal text-outline line-through">
									{delivery.toLocaleString("en-EG")} EGP
								</span>
							)}
							{isFreeDelivery
								? `Free`
								: delivery.toLocaleString("en-EG") + " EGP"}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span>Estimated VAT (14%)</span>
						<span className="text-label-sm text-outline">
							Included in total
						</span>
					</div>
				</div>

				<div className="h-px w-full bg-surface-container" />

				<div className="flex items-baseline justify-between pt-space-xs">
					<div>
						<span className="block text-title-md font-bold leading-tight text-on-surface">
							Total Amount
						</span>
						<span className="text-label-sm text-outline">
							Inclusive of all local taxes
						</span>
					</div>
					<div className="text-right">
						<span className="text-headline-lg font-extrabold text-on-surface">
							{total.toLocaleString("en-EG")}
						</span>{" "}
						<span className="text-title-md font-bold text-primary">EGP</span>
					</div>
				</div>

				{isPaymentStep ? (
					<>
						<button
							type="button"
							onClick={handlePlaceOrder}
							disabled={!selectedAddress || placeOrderMutation.isPending}
							className={`${checkoutButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
						>
							<span className="text-md text-white">
								{placeOrderMutation.isPending
									? "Placing Order..."
									: `Place Order (${itemCount} items)`}
							</span>
						</button>
						{placeOrderMutation.error && (
							<p role="alert" className="text-label-sm text-error">
								{placeOrderMutation.error.message}
							</p>
						)}
					</>
				) : (
					<Link
						to={checkoutStep.to}
						className={checkoutButtonClass}
					>
						<span className="text-md text-white">
							{checkoutStep.label} ({itemCount} items)
						</span>
					</Link>
				)}
			</section>

			<section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
				<label
					htmlFor="promo-input"
					className="flex items-center justify-between text-label-lg font-bold text-on-surface"
				>
					<span>Apply Coupon or Gift Code</span>
					<span aria-hidden="true">🏷</span>
				</label>
				<div className="flex flex-col gap-space-xs">
					<div className="flex gap-space-xs">
						<input
							id="promo-input"
							type="text"
							value={couponInput}
							onChange={(event) => setCouponInput(event.target.value)}
							placeholder="e.g. WELCOME50"
							className="h-11 min-w-0 flex-1 rounded-lg bg-surface-container-low px-space-md text-body-sm text-on-surface placeholder:text-outline focus:outline-2 focus:outline-primary"
						/>
						<button
							type="button"
							onClick={applyCoupon}
							className="h-11 rounded-lg bg-surface-container-highest px-space-lg text-label-md font-bold text-on-surface transition-colors hover:bg-surface-variant"
						>
							Apply
						</button>
					</div>
					{couponError && (
						<p role="alert" className="text-label-sm text-error">
							{couponError}
						</p>
					)}
				</div>
			</section>
		</aside>
	);
}

export default OrderSummary;

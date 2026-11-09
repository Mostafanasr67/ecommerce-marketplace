import { createContext, useContext } from "react";

type CheckoutCouponState = {
	code: string | null;
	setCode: (code: string | null) => void;
};

const CheckoutCouponContext = createContext<CheckoutCouponState | null>(null);

function useCheckoutCoupon() {
	const value = useContext(CheckoutCouponContext);
	if (!value) throw new Error("CheckoutCouponProvider is missing");
	return value;
}

export { CheckoutCouponContext, useCheckoutCoupon };

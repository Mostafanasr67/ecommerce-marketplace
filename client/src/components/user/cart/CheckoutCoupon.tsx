import { useState } from "react";
import type { ReactNode } from "react";
import { CheckoutCouponContext } from "./checkoutCouponContext";

function CheckoutCouponProvider({ children }: { children: ReactNode }) {
	const [code, setCode] = useState<string | null>(null);
	return <CheckoutCouponContext.Provider value={{ code, setCode }}>{children}</CheckoutCouponContext.Provider>;
}

export { CheckoutCouponProvider };

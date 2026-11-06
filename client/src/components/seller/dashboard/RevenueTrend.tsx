import { useState } from "react";
import type { SellerOrder } from "../../../types/seller";

function RevenueTrend({ orders }: { orders: SellerOrder[] }) {
	const [range, setRange] = useState<"7d" | "30d">("30d");
	const days = range === "7d" ? 7 : 30;
	const today = new Date();
	const dates = Array.from({ length: days }, (_, index) => {
		const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		date.setDate(date.getDate() - (days - index - 1));
		return date;
	});
	const totals = dates.map((date) => {
		const nextDay = new Date(date);
		nextDay.setDate(nextDay.getDate() + 1);
		return orders.reduce((total, order) => {
			const createdAt = new Date(order.createdAt);
			return order.status !== "CANCELLED" && createdAt >= date && createdAt < nextDay
				? total + Number(order.subTotal) : total;
		}, 0);
	});
	const peak = Math.max(...totals);
	const scale = peak || 1;
	const points = totals.map((total, index) => `${index * 700 / (days - 1)},${170 - total / scale * 150}`).join(" ");
	const average = totals.reduce((sum, total) => sum + total, 0) / days;
	const formatDate = (date: Date) => date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

	return (
		<section className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-8">
			<div className="mb-space-md flex flex-col justify-between gap-space-sm sm:flex-row sm:items-center">
				<div>
					<h2 className="font-headline-sm text-on-surface">Revenue Trend</h2>
					<p className="mt-0.5 font-label-sm text-secondary">Daily order value in EGP, excluding cancelled orders</p>
				</div>
				<div className="inline-flex self-start rounded-xl bg-surface-container p-1 shadow-sm sm:self-auto" aria-label="Chart range">
					{(["7d", "30d"] as const).map((value) => (
						<button key={value} type="button" aria-pressed={range === value} onClick={() => setRange(value)}
							className={`rounded-xl px-3 py-1.5 font-label-sm transition-all ${range === value ? "bg-surface-container-lowest font-bold text-primary shadow-sm" : "text-secondary hover:text-on-surface"}`}>
							{value === "7d" ? "7 Days" : "30 Days"}
						</button>
					))}
				</div>
			</div>
			<div className="relative flex h-56 w-full flex-col justify-end pt-4">
				<svg className="h-44 w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 180" role="img" aria-label={`${days}-day order value trend, peak ${peak} EGP`}>
					<polyline fill="none" points={points} stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
				</svg>
				<div className="flex justify-between pt-3 font-label-sm text-secondary">
					<span>{formatDate(dates[0])}</span><span>{formatDate(dates[dates.length - 1])}</span>
				</div>
			</div>
			<div className="mt-space-sm rounded-xl bg-surface-container-low/40 px-space-md py-2 font-label-sm text-on-surface-variant">
				Average daily order value: <strong>{average.toLocaleString("en-EG", { maximumFractionDigits: 2 })} EGP</strong>
			</div>
		</section>
	);
}

export default RevenueTrend;

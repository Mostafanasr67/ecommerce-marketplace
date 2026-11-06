import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard, type CardInput, type SavedCard } from "./CardHelper";

const inputClass =
	"w-full rounded-lg border-none bg-surface-container-low px-space-md py-space-sm font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary";
const labelClass = "font-label-md text-label-md font-semibold text-on-surface-variant";

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;
const yearOptions = Array.from({ length: 16 }, (_, i) => currentYear + i);
const allMonthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

type PaymentCardFormProps = {
	onSaved?: (card: SavedCard) => void;
};

function toFormValues(): CardInput {
	return {
		holderName: "",
		cardNumber: "",
		expiryMonth: currentMonth,
		expiryYear: currentYear,
		cvv: "",
	};
}

function PaymentCardForm({ onSaved }: PaymentCardFormProps) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [values, setValues] = useState<CardInput>(toFormValues);
	const [validationError, setValidationError] = useState<string | null>(null);

	const monthOptions = values.expiryYear === currentYear
		? allMonthOptions.filter((month) => month >= currentMonth)
		: allMonthOptions;

	function updateField<K extends keyof CardInput>(name: K, value: CardInput[K]) {
		setValues((prev) => ({ ...prev, [name]: value }));
	}

	const createCardMutation = useMutation({
		mutationFn: (data: CardInput) => createCard(data),
		onSuccess: (card) => {
			queryClient.invalidateQueries({ queryKey: ["cards"] });
			setValues(toFormValues());
			onSaved?.(card);
			setOpen(false);
		},
	});

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const cardNumber = values.cardNumber.replace(/\s/g, "");
		if (!values.holderName.trim()) {
			setValidationError("Please enter the name on the card");
			return;
		}
		if (!/^\d{12,19}$/.test(cardNumber)) {
			setValidationError("Please enter a valid card number");
			return;
		}
		if (!/^\d{3,4}$/.test(values.cvv)) {
			setValidationError("Please enter a valid CVV");
			return;
		}
		setValidationError(null);
		createCardMutation.mutate({ ...values, cardNumber });
	}

	return (
		<section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
			<button
				type="button"
				aria-expanded={open}
				onClick={() => setOpen((prev) => !prev)}
				className="flex w-full cursor-pointer select-none items-center justify-between bg-surface-container-low p-space-lg text-left transition-colors hover:bg-surface-container"
			>
				<div className="flex items-center gap-space-sm">
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
						<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
							<rect x="2" y="5" width="16" height="12" rx="2" />
							<path d="M2 10h16M6 14h3" />
							<path d="M19 8v6M16 11h6" />
						</svg>
					</div>
					<div>
						<p className="font-headline-sm text-headline-sm font-bold text-on-surface">
							Add a new debit or credit card
						</p>
						
					</div>
				</div>
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className={`h-5 w-5 text-on-surface transition-transform ${open ? "" : "rotate-180"}`}
				>
					<path d="m6 15 6-6 6 6" />
				</svg>
			</button>

			{open && (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-space-md p-space-lg"
		>

			<div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
				<label className="flex flex-col gap-space-xs md:col-span-2">
					<span className={labelClass}>Name on card</span>
					<input
						type="text"
						autoComplete="cc-name"
						className={inputClass}
						placeholder="Full name as on card"
						value={values.holderName}
						onChange={(e) => updateField("holderName", e.target.value)}
					/>
				</label>

				<label className="flex flex-col gap-space-xs md:col-span-2">
					<span className={labelClass}>Card number</span>
					<input
						type="text"
						inputMode="numeric"
						autoComplete="cc-number"
						className={inputClass}
						placeholder="0000 0000 0000 0000"
						maxLength={23}
						value={values.cardNumber}
						onChange={(e) => updateField("cardNumber", e.target.value)}
					/>
				</label>

				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>Expiry month</span>
					<select
						className={inputClass}
						value={values.expiryMonth}
						onChange={(e) => updateField("expiryMonth", Number(e.target.value))}
					>
						{monthOptions.map((month) => (
							<option key={month} value={month}>
								{String(month).padStart(2, "0")}
							</option>
						))}
					</select>
				</label>

				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>Expiry year</span>
					<select
						className={inputClass}
						value={values.expiryYear}
						onChange={(e) => {
							const year = Number(e.target.value);
							setValues((prev) => ({
								...prev,
								expiryYear: year,
								expiryMonth: year === currentYear && prev.expiryMonth < currentMonth ? currentMonth : prev.expiryMonth,
							}));
						}}
					>
						{yearOptions.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</label>

				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>CVV</span>
					<input
						type="password"
						inputMode="numeric"
						autoComplete="cc-csc"
						className={inputClass}
						placeholder="•••"
						maxLength={4}
						value={values.cvv}
						onChange={(e) => updateField("cvv", e.target.value)}
					/>
				</label>
			</div>

			{(validationError || createCardMutation.isError) && (
				<p className="font-body-sm text-body-sm text-error">
					{validationError ?? createCardMutation.error?.message}
				</p>
			)}

			<div className="flex justify-end gap-space-sm">
				<button
					type="button"
					onClick={() => {
						setValues(toFormValues());
						setValidationError(null);
						setOpen(false);
					}}
					className="rounded-lg bg-surface-container-low px-space-lg py-space-sm font-label-md text-label-md font-semibold text-on-surface-variant hover:bg-surface-container"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={createCardMutation.isPending}
					className="rounded-lg bg-primary px-space-lg py-space-sm font-label-md text-label-md font-semibold text-on-primary disabled:opacity-60"
				>
					Save Card
				</button>
			</div>
		</form>
			)}
		</section>
	);
}

export default PaymentCardForm;

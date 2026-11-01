import PaymentCardForm from "./PaymentCardForm";
import SavedCards from "./SavedCards";
import type { SavedCard } from "./CardHelper";

type PaymentMethodsProps = {
	paymentMethod: string;
	setPaymentMethod: (method: string) => void;
	selectedCard: SavedCard | null;
	setSelectedCard: (card: SavedCard | null) => void;
};

function PaymentMethods({ paymentMethod, setPaymentMethod, selectedCard, setSelectedCard }: PaymentMethodsProps) {
	return (
		<section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
				Select Payment Method
			</h2>

			<label className="flex cursor-pointer items-center gap-space-md rounded-xl border border-outline-variant p-space-md transition-colors hover:bg-surface-container-low">
				<input
					type="radio"
					name="payment_method"
					value="card"
					checked={paymentMethod === "card"}
					onChange={() => setPaymentMethod("card")}
					className="h-5 w-5 accent-primary"
				/>
				<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-primary">
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
						<rect x="2" y="5" width="20" height="14" rx="2" />
						<path d="M2 10h20M6 15h4" />
					</svg>
				</span>
				<div>
					<span className="block font-title-md text-title-md font-bold text-on-surface">
						Credit / Debit Card
					</span>
					<span className="block font-body-md text-body-md text-on-surface-variant">
						Visa, Mastercard, and Meeza cards
					</span>
				</div>
			</label>

			{paymentMethod === "card" && (
				<div className="flex flex-col gap-space-md">
					<SavedCards selectedCard={selectedCard} setSelectedCard={setSelectedCard} />

					<PaymentCardForm onSaved={(card) => setSelectedCard(card)} />
				</div>
			)}

			<label className="flex cursor-pointer items-center gap-space-md rounded-xl border border-outline-variant p-space-md transition-colors hover:bg-surface-container-low">
				<input
					type="radio"
					name="payment_method"
					value="cod"
					checked={paymentMethod === "cod"}
					onChange={() => setPaymentMethod("cod")}
					className="h-5 w-5 accent-primary"
				/>
				<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-primary">
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
						<rect x="2" y="6" width="20" height="12" rx="2" />
						<circle cx="12" cy="12" r="2.5" />
						<path d="M6 12h.01M18 12h.01" />
					</svg>
				</span>
				<div>
					<span className="block font-title-md text-title-md font-bold text-on-surface">
						Cash on Delivery
					</span>
					<span className="block font-body-md text-body-md text-on-surface-variant">
						Pay the courier when your order arrives
					</span>
				</div>
			</label>
		</section>
	);
}

export default PaymentMethods;

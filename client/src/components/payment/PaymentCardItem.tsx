import { useState } from "react";
import type { SavedCard } from "./CardHelper";

type PaymentCardItemProps = {
	card: SavedCard;
	isDefault?: boolean;
	isSelected?: boolean;
	onDelete?: () => void;
	onSetDefault?: () => void;
	onSelect?: () => void;
};

const expiry = (month: number, year: number) => `${String(month).padStart(2, "0")} / ${String(year).slice(-2)}`;

function PaymentCardItem({
	card,
	isDefault,
	isSelected,
	onDelete,
	onSetDefault,
	onSelect,
}: PaymentCardItemProps) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<article
			className={`relative rounded-xl p-space-lg transition-all ${
				isDefault
					? "bg-surface-container-lowest shadow-md"
					: "bg-surface-container-low hover:bg-surface-container"
			}`}
		>
			<div className="flex items-start gap-space-md">
				<input
					type="radio"
					name="payment_card"
					checked={isSelected}
					aria-label={`Pay with ${card.brand} ending ${card.last4}`}
					className="mt-1 h-5 w-5 cursor-pointer accent-primary"
					onChange={onSelect}
				/>

				<div className="flex flex-1 flex-col gap-space-sm">
					<div className="flex flex-wrap items-center gap-space-xs">
						<span className="font-title-md text-title-md font-bold text-on-surface">
							{card.brand} •••• {card.last4}
						</span>
						{isDefault && (
							<span className="rounded bg-primary px-2 py-0.5 font-label-sm text-label-sm font-semibold tracking-wide text-on-primary">
								DEFAULT CARD
							</span>
						)}
						<div className="relative ms-auto">
							<button
								type="button"
								aria-label="Card options"
								aria-expanded={menuOpen}
								onClick={() => setMenuOpen((open) => !open)}
								className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="h-5 w-5"
									aria-hidden="true"
								>
									<circle cx="5" cy="12" r="2" />
									<circle cx="12" cy="12" r="2" />
									<circle cx="19" cy="12" r="2" />
								</svg>
							</button>

							{menuOpen && (
								<>
									<div
										className="fixed inset-0 z-10"
										onClick={() => setMenuOpen(false)}
									/>
									<div className="absolute right-0 z-20 mt-1 flex w-44 flex-col gap-1 rounded-lg bg-surface-container-lowest p-1 shadow-lg">
										{!isDefault && (
											<button
												type="button"
												onClick={() => {
													setMenuOpen(false);
													onSetDefault?.();
												}}
												className="flex items-center gap-2 rounded-md px-3 py-2 text-left font-label-md text-label-md text-primary transition-colors hover:bg-primary hover:text-on-primary"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="h-4 w-4"
													aria-hidden="true"
												>
													<circle cx="12" cy="12" r="10" />
													<path d="m9 12 2 2 4-4" />
												</svg>
												Set as default
											</button>
										)}
										<button
											type="button"
											onClick={() => {
												setMenuOpen(false);
												onDelete?.();
											}}
											className="flex items-center gap-2 rounded-md px-3 py-2 text-left font-label-md text-label-md text-error transition-colors hover:bg-error hover:text-on-primary"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-4 w-4"
												aria-hidden="true"
											>
												<path d="M3 6h18" />
												<path d="M8 6V4h8v2" />
												<path d="M19 6l-1 14H6L5 6" />
												<path d="M10 11v6" />
												<path d="M14 11v6" />
											</svg>
											Delete
										</button>
									</div>
								</>
							)}
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-space-md font-label-md text-label-md text-on-surface-variant">
						<span className="text-body-sm font-bold text-on-surface">
							{card.holderName}
						</span>
						<span className="text-on-surface">Expires {expiry(card.expiryMonth, card.expiryYear)}</span>
					</div>
				</div>
			</div>
		</article>
	);
}

export default PaymentCardItem;

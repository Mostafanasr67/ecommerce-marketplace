import { useState } from "react";
import type { Address } from "./AddressHelper";

type AddressCardProps = {
	address: Address;
	isDefault?: boolean;
	isSelected?: boolean;
	onEdit?: () => void;
	onDelete?: () => void;
	onSetDefault?: () => void;
};

function AddressCard({
	address,
	isDefault,
	onEdit,
	onDelete,
	onSetDefault,
}: AddressCardProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const locality = [address.area, address.city, address.country]
		.filter(Boolean)
		.join(", ");
	const unit = [
		address.building && `Building ${address.building}`,
		address.apartment && `Apt ${address.apartment}`,
	]
		.filter(Boolean)
		.join(", ");

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
					name="delivery_address"
					defaultChecked={isDefault}
					aria-label={`Deliver to ${address.label}`}
					className="mt-1 h-5 w-5 cursor-pointer accent-primary"
				/>

				<div className="flex flex-1 flex-col gap-space-sm">
					<div className="flex flex-wrap items-center gap-space-xs">
						<span className="font-title-md text-title-md font-bold text-on-surface">
							{address.label}
						</span>
						{isDefault && (
							<span className="rounded bg-primary px-2 py-0.5 font-label-sm text-label-sm font-semibold tracking-wide text-on-primary">
								DEFAULT ADDRESS
							</span>
						)}
						<div className="relative ms-auto">
							<button
								type="button"
								aria-label="Address options"
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
												onEdit?.();
											}}
											className="flex items-center gap-2 rounded-md px-3 py-2 text-left font-label-md text-label-md text-primary transition-colors hover:bg-surface-container"
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
												<path d="M12 20h9" />
												<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
											</svg>
											Edit
										</button>
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
							{address.fullName}
						</span>
						<span className="flex items-center gap-1 text-on-surface">
							<span aria-hidden="true" className="text-xs">
								📞
							</span>
							{address.phone}
						</span>
					</div>

					<p className="font-body-md leading-relaxed text-on-surface">
						{address.street}
						{unit && `, ${unit}`}
					</p>

					<p className="font-body-sm text-body-sm text-on-surface-variant">
						{locality}
					</p>
				</div>
			</div>
		</article>
	);
}

export default AddressCard;

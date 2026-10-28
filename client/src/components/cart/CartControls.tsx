type CartControlsProps = {
	subtotal: number;
};

function CartControls({
	subtotal,
}: CartControlsProps) {
	const progress = Math.min(Math.floor((subtotal / 2000) * 100), 100);
	const remaining = Math.max(2000 - subtotal, 0);

	return (
		<section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex flex-wrap items-center justify-between gap-space-md">
				<div className="flex items-center gap-space-sm">
					<h1 className="text-headline-md font-extrabold tracking-tight text-on-surface">
						Shopping Cart
					</h1>
				</div>

				<div className="flex items-center gap-space-xs rounded-full bg-surface-container-low px-space-md py-1.5 text-body-sm text-on-surface-variant">
					<span className="text-primary" aria-hidden="true">
						⌖
					</span>
					<span>
						Delivering to:{" "}
						<strong className="font-semibold text-on-surface">
							New Cairo, Cairo
						</strong>
					</span>
					<button type="button" className="ml-space-xs text-label-sm font-bold text-primary hover:underline">
						Change
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-md">
				<div className="flex items-center justify-between gap-space-md text-body-sm">
					
					
						<span className="font-semibold text-on-surface">
						<span className="mr-space-xs text-primary" aria-hidden="true">
							🚚
						</span>
						{subtotal < 2000 ? (
						<span> Add <strong className="text-primary">{remaining} EGP</strong>  more to unlock
						Free Express Delivery!
					</span>
					) : (
						<span className="font-semibold text-on-surface">
							You have unlocked Free Express Delivery!
						</span>
					)}
					</span>

					<span className="shrink-0 text-label-md font-bold text-primary">
						{progress}% Unlocked
					</span>
				</div>
				<div className="h-2 w-full mt-4 overflow-hidden rounded-full bg-surface-container-highest">
					<div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
				</div>
			</div>

			
		</section>
	);
}

export default CartControls;

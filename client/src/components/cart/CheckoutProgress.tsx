const steps = [
	{
		number: 1,
		title: "Shopping Cart",
		description: "Review your items",
	},
	{
		number: 2,
		title: "Address",
		description: "Delivery details",
	},
	{
		number: 3,
		title: "Payment",
		description: "Safe transaction",
	},
	{
		number: 4,
		title: "Confirmation",
		description: "Tracking & receipt",
	},
];

type CheckoutProgressProps = {
	activeStep?: number;
};

function CheckoutProgress({ activeStep = 1 }: CheckoutProgressProps) {
	return (
		<nav
			aria-label="Checkout progress"
			className="mb-space-xl overflow-x-auto rounded-xl bg-surface-container-lowest px-space-lg py-space-md shadow-sm"
		>
			<ol className="flex min-w-2xl items-center">
				{steps.map((step, index) => {
					const isActive = step.number === activeStep;
					return (
					<li
						key={step.title}
						className={`flex items-center ${
							index < steps.length - 1 ? "flex-1" : ""
						}`}
						aria-current={isActive ? "step" : undefined}
					>
						<div
							className={`flex shrink-0 items-center gap-space-sm ${
								isActive ? "text-on-surface" : "opacity-45"
							}`}
						>
							<span
								className={`flex h-8 w-8 items-center justify-center rounded-full text-label-md font-bold ${
									isActive
										? "bg-primary text-on-primary"
										: "bg-surface-container-high text-on-surface-variant"
								}`}
							>
								{step.number}
							</span>
							<span className="flex flex-col">
								<span className="text-label-lg font-semibold">
									{step.title}
								</span>
								<span className="text-label-sm text-outline">
									{step.description}
								</span>
							</span>
						</div>

						{index < steps.length - 1 && (
							<div className="mx-space-md h-0.5 min-w-8 flex-1 rounded-full bg-surface-container-high" />
						)}
					</li>
					);
				})}
			</ol>
		</nav>
	);
}

export default CheckoutProgress;

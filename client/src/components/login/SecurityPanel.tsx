interface SecurityFeature {
	icon: string;
	title: string;
	description: string;
}

function SecurityPanel() {
	const features: SecurityFeature[] = [
		{
			icon: "gavel",
			title: "Secure Transactions",
			description: "Your data remains protected with industry-standard encryption and security protocols.",
		},
		{
			icon: "local_shipping",
			title: "Verified Checkout",
			description: "Real-time verification of transactions with transparent tracking and updates.",
		},
		{
			icon: "credit_card",
			title: "Multiple Payment Options",
			description: "Support for various payment methods with flexible and secure payment processing.",
		},
		{
			icon: "privacy_tip",
			title: "Privacy First",
			description: "We never sell your data. Your information is yours alone and protected always.",
		},
	];

	return (
		<div className="flex flex-col gap-space-md">
			{/* Assurances Card */}
			<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col gap-space-md">
				<div className="flex items-center justify-between">
					<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
						Security Assurances
					</span>
					<span className="material-symbols-outlined text-primary text-[22px]">assured_workload</span>
				</div>
				<h2 className="font-headline-sm text-headline-sm text-on-surface">Built for Secure Transactions</h2>
				<div className="flex flex-col gap-space-md">
					{features.map((feature) => (
						<div key={feature.icon} className="flex items-start gap-space-sm">
							<div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
								<span className="material-symbols-outlined text-primary text-[18px]">{feature.icon}</span>
							</div>
							<div className="flex flex-col min-w-0">
								<span className="font-title-md text-title-md text-on-surface">{feature.title}</span>
								<span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
									{feature.description}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Compliance Banner */}
			<div className="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col gap-2">
				<div className="flex items-center gap-2 text-on-surface font-label-md text-label-md font-semibold">
					<span className="material-symbols-outlined text-primary text-[18px]">shield</span>
					<span>Industry Compliance</span>
				</div>
				<p className="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
					All data handling and transactions comply with international security standards and local regulations.
				</p>
				<div className="pt-1 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
					<span>256-Bit TLS 1.3 Encryption</span>
					<span className="material-symbols-outlined text-[16px]">check_circle</span>
				</div>
			</div>
		</div>
	);
}

export default SecurityPanel;

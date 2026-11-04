function ProfileHeader() {
	const profileData = {
		name: "Karim Mahmoud",
		email: "karim.m@example.com",
		avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpIchwtr70TVJKZrzdJSlB-Y06APxoDb96XIhNpz9Xu1Z0_BLsgbnjTEuDq2Tq929bHcFcgc9zEJ6s5WJSt6yHCGWts23QOARQ4BKdZmLYcxuK7FYA12LcYgsQK0PeFk2cHXwP2BxxtyURQn2BpWrzm4z0ZUzcEi9iOTSLoPNdRgbPI9su6cx7caGw05lFHQqQQ3quRKOqo4ZhsT1vhkKK_qmNtJE1ctyLdimGcNo",
		verified: true,
		phone: "+20 100 ••• 5678",
		memberSince: "Nov 2023",
		profileStrength: 85,
		tier: "Tier 1 Sovereign Buyer",
	};

	return (
		<div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-lg">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-md bg-surface-container-low/70 -mx-space-lg -mt-space-lg p-space-lg rounded-t-2xl">
				<div className="flex items-center gap-space-md">
					<div className="relative">
						<img
							className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-surface-container-highest"
							src={profileData.avatar}
							alt={profileData.name}
						/>
						<button
							className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-on-primary rounded-lg flex items-center justify-center hover:bg-primary-container shadow-sm transition-transform active:scale-95"
							title="Change Avatar"
							type="button"
						>
							<span className="material-symbols-outlined text-base">camera_alt</span>
						</button>
					</div>
					<div className="flex flex-col">
						<div className="flex items-center gap-space-xs flex-wrap">
							<span className="font-headline-md text-headline-md text-on-surface font-bold">
								{profileData.name}
							</span>
							{profileData.verified && (
								<span
									className="material-symbols-outlined text-primary text-xl"
									style={{ fontVariationSettings: "'FILL' 1" }}
									title="Identity Verified by Sovereign Trust Operations"
								>
									verified
								</span>
							)}
						</div>
						<span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
							{profileData.email}
						</span>
						<div className="flex items-center gap-space-sm mt-1 text-on-surface-variant font-label-sm text-label-sm">
							<span className="flex items-center gap-1 text-emerald-700 font-semibold">
								<span
									className="material-symbols-outlined text-sm"
									style={{ fontVariationSettings: "'FILL' 1" }}
								>
									verified
								</span>
								Egyptian Telco Verified ({profileData.phone})
							</span>
							<span>•</span>
							<span>Registered Member since {profileData.memberSince}</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-space-md bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm self-start sm:self-auto">
					<div className="relative w-12 h-12 flex items-center justify-center">
						<svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
							<circle
								className="text-surface-container-highest"
								cx="24"
								cy="24"
								fill="none"
								r="20"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<circle
								className="text-primary"
								cx="24"
								cy="24"
								fill="none"
								r="20"
								stroke="currentColor"
								strokeDasharray="125.6"
								strokeDashoffset="18.84"
								strokeLinecap="round"
								strokeWidth="4"
							></circle>
						</svg>
						<span className="absolute font-label-sm text-label-sm font-bold text-on-surface">
							{profileData.profileStrength}%
						</span>
					</div>
					<div className="flex flex-col">
						<span className="font-label-md text-label-md text-on-surface font-bold leading-tight">
							Profile Strength
						</span>
						<span className="font-label-sm text-label-sm text-outline">{profileData.tier}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfileHeader;

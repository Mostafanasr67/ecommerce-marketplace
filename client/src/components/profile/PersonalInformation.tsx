function PersonalInformation() {
	const formData = {
		fullName: "Karim Ahmed Mahmoud",
		email: "karim.m@example.com",
		primaryPhone: "100 234 5678",
		alternatePhone: "122 876 5432",
		dateOfBirth: "1992-06-18",
		gender: "male",
		language: "en",
	};

	return (
		<div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-lg">
			<div>
				<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
					Personal Information
				</h2>
				<p className="font-body-sm text-body-sm text-on-surface-variant">
					Update your legal identity and national contact coordinates.
				</p>
			</div>

			<form className="md:grid md:grid-cols-2 gap-space-md flex flex-col gap-space-md">
				{/* Full Name */}
				<div className="flex flex-col gap-1.5">
					<label className="font-label-lg text-label-lg font-semibold text-on-surface">
						Full Legal Name
					</label>
					<div className="relative flex items-center">
						<input
							className="w-full h-11 px-space-md rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
							type="text"
							value={formData.fullName}
							readOnly
						/>
						<span className="material-symbols-outlined text-outline text-lg absolute right-3 pointer-events-none">
							person
						</span>
					</div>
				</div>

				{/* Email */}
				<div className="flex flex-col gap-1.5">
					<label className="font-label-lg text-label-lg font-semibold text-on-surface">
						Primary Email
					</label>
					<div className="relative flex items-center">
						<input
							className="w-full h-11 px-space-md rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
							type="email"
							value={formData.email}
							readOnly
						/>
						<span className="material-symbols-outlined text-outline text-lg absolute right-3 pointer-events-none">
							mail
						</span>
					</div>
					<button
						className="h-11 px-space-md bg-surface-container-highest hover:bg-surface-variant text-on-surface font-label-lg text-label-lg font-semibold rounded-xl transition-colors shrink-0"
						type="button"
					>
						Change Email
					</button>
				</div>

				{/* Primary Phone */}
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between">
						<label className="font-label-lg text-label-lg font-semibold text-on-surface">
							Primary Phone
						</label>
						<span className="font-label-sm text-label-sm text-emerald-700 font-bold flex items-center gap-1">
							<span
								className="material-symbols-outlined text-xs"
								style={{ fontVariationSettings: "'FILL' 1" }}
							>
								verified
							</span>
							OTP Verified
						</span>
					</div>
					<div className="relative flex items-center">
						<span className="absolute left-3 font-label-md text-label-md font-bold text-on-surface flex items-center gap-1 pointer-events-none">
							🇪🇬 +20
						</span>
						<input
							className="w-full h-11 pl-16 pr-space-md rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium font-mono"
							type="tel"
							value={formData.primaryPhone}
							readOnly
						/>
					</div>
				</div>

				{/* Date of Birth */}
				<div className="flex flex-col gap-1.5">
					<label className="font-label-lg text-label-lg font-semibold text-on-surface">
						Date of Birth
					</label>
					<div className="relative flex items-center">
						<input
							className="w-full h-11 px-space-md rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
							type="date"
							value={formData.dateOfBirth}
							readOnly
						/>
					</div>
				</div>

				{/* Gender */}
				<div className="flex flex-col gap-1.5">
					<label className="font-label-lg text-label-lg font-semibold text-on-surface">Gender</label>
					<div className="relative flex items-center">
						<select
							className="w-full h-11 px-space-md rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
							value={formData.gender}
							disabled
						>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="prefer_not">Prefer not to say</option>
						</select>
						<span className="material-symbols-outlined text-outline text-xl absolute right-3 pointer-events-none">
							expand_more
						</span>
					</div>
				</div>

				{/* Action Footer */}
				<div className="md:col-span-2 pt-space-sm flex items-center justify-end border-t-0 mt-space-sm">
					
					<button
						className="h-11 px-space-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg transition-all active:scale-[0.99] flex items-center gap-2"
						type="submit"
					>
						<span>Save Personal Changes</span>
					</button>
				</div>
			</form>
		</div>
	);
}

export default PersonalInformation;

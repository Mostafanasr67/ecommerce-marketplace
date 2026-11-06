interface SignupFormProps {
	onSubmit: (name: string, email: string, password: string, confirmPassword: string) => void;
	isLoading?: boolean;
}

function SignupForm({ onSubmit, isLoading = false }: SignupFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			alert("Passwords do not match");
			return;
		}
		onSubmit(formData.name, formData.email, formData.password, formData.confirmPassword);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
			{/* Full Name */}
			<div className="flex flex-col gap-space-xs">
				<label htmlFor="name" className="font-label-md text-label-md text-on-surface font-semibold">
					Full Name
				</label>
				<input
					id="name"
					type="text"
					name="name"
					placeholder="John Doe"
					value={formData.name}
					onChange={handleChange}
					disabled={isLoading}
					className="w-full px-space-md py-space-sm border-2 border-surface-container rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none disabled:bg-surface-container-low disabled:cursor-not-allowed transition-colors"
					required
				/>
			</div>

			{/* Email Input */}
			<div className="flex flex-col gap-space-xs">
				<label htmlFor="email" className="font-label-md text-label-md text-on-surface font-semibold">
					Email Address
				</label>
				<input
					id="email"
					type="email"
					name="email"
					placeholder="you@company.com"
					value={formData.email}
					onChange={handleChange}
					disabled={isLoading}
					className="w-full px-space-md py-space-sm border-2 border-surface-container rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none disabled:bg-surface-container-low disabled:cursor-not-allowed transition-colors"
					required
				/>
			</div>

			{/* Password Input */}
			<div className="flex flex-col gap-space-xs">
				<label htmlFor="password" className="font-label-md text-label-md text-on-surface font-semibold">
					Password
				</label>
				<div className="relative flex items-center">
					<input
						id="password"
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="••••••••••"
						value={formData.password}
						onChange={handleChange}
						disabled={isLoading}
						className="w-full px-space-md py-space-sm border-2 border-surface-container rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none disabled:bg-surface-container-low disabled:cursor-not-allowed transition-colors pr-12"
						required
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						disabled={isLoading}
						className="absolute right-3 text-on-surface-variant hover:text-on-surface disabled:cursor-not-allowed transition-colors"
					>
						<span className="material-symbols-outlined text-lg">
							{showPassword ? "visibility_off" : "visibility"}
						</span>
					</button>
				</div>
			</div>

			{/* Confirm Password */}
			<div className="flex flex-col gap-space-xs">
				<label htmlFor="confirmPassword" className="font-label-md text-label-md text-on-surface font-semibold">
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					type={showPassword ? "text" : "password"}
					name="confirmPassword"
					placeholder="••••••••••"
					value={formData.confirmPassword}
					onChange={handleChange}
					disabled={isLoading}
					className="w-full px-space-md py-space-sm border-2 border-surface-container rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none disabled:bg-surface-container-low disabled:cursor-not-allowed transition-colors"
					required
				/>
			</div>

			{/* Terms Agreement */}
			<div className="flex items-start gap-space-sm">
				<input
					id="terms"
					type="checkbox"
					required
					disabled={isLoading}
					className="w-4 h-4 rounded cursor-pointer disabled:cursor-not-allowed mt-1"
				/>
				<label htmlFor="terms" className="font-label-sm text-label-sm text-on-surface-variant cursor-pointer">
					I agree to the{" "}
					<a href="#terms" className="text-primary hover:underline font-semibold">
						Terms of Service
					</a>{" "}
					and{" "}
					<a href="#privacy" className="text-primary hover:underline font-semibold">
						Privacy Policy
					</a>
				</label>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={isLoading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
				className="w-full mt-space-md py-space-sm bg-primary text-on-primary font-label-lg text-label-lg font-semibold rounded-lg hover:bg-primary-container hover:text-primary transition-colors disabled:bg-surface-container disabled:text-on-surface-variant disabled:cursor-not-allowed flex items-center justify-center gap-space-xs"
			>
				{isLoading && (
					<span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
				)}
				<span>{isLoading ? "Creating Account..." : "Create Account"}</span>
			</button>
		</form>
	);
}

import { useState } from "react";

export default SignupForm;

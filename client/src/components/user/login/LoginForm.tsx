import { useState } from "react";

interface LoginFormProps {
	onSubmit: (email: string, password: string) => void;
	isLoading?: boolean;
}

function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(email, password);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
			{/* Email Input */}
			<div className="flex flex-col gap-space-xs">
				<label htmlFor="email" className="font-label-md text-label-md text-on-surface font-semibold">
					Email Address
				</label>
				<input
					id="email"
					type="email"
					placeholder="you@company.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isLoading}
					className="w-full px-space-md py-space-sm border-2 border-surface-container rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none disabled:bg-surface-container-low disabled:cursor-not-allowed transition-colors"
					required
				/>
			</div>

			{/* Password Input */}
			<div className="flex flex-col gap-space-xs">
				<div className="flex items-center justify-between">
					<label htmlFor="password" className="font-label-md text-label-md text-on-surface font-semibold">
						Password
					</label>
					<a href="#forgot-password" className="font-label-sm text-label-sm text-primary hover:underline">
						Forgot?
					</a>
				</div>
				<div className="relative flex items-center">
					<input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="••••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
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

			{/* Remember Me */}
			<div className="flex items-center gap-space-sm">
				<input
					id="remember"
					type="checkbox"
					disabled={isLoading}
					className="w-4 h-4 rounded cursor-pointer disabled:cursor-not-allowed"
				/>
				<label htmlFor="remember" className="font-label-sm text-label-sm text-on-surface-variant cursor-pointer">
					Remember me for 30 days
				</label>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={isLoading || !email || !password}
				className="w-full mt-space-md py-space-sm bg-primary text-on-primary font-label-lg text-label-lg font-semibold rounded-lg hover:bg-primary-container hover:text-primary transition-colors disabled:bg-surface-container disabled:text-on-surface-variant disabled:cursor-not-allowed flex items-center justify-center gap-space-xs"
			>
				{isLoading && (
					<span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
				)}
				<span>{isLoading ? "Logging in..." : "Log In"}</span>
			</button>
		</form>
	);
}

export default LoginForm;

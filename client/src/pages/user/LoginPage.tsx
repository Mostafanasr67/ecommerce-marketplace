import { useState } from "react";
import GoogleAuthButton from "../../components/user/login/GoogleAuthButton";
import LoginFooter from "../../components/user/login/LoginFooter";

function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleAuth = () => {
		setIsLoading(true);
		window.location.href = "http://localhost:5000/auth/google";
	};

	return (
		<main className="min-h-screen bg-surface font-body-md text-on-surface flex flex-col">
			{/* Background Grid */}
			<div className="pointer-events-none fixed inset-0 z-0 opacity-40 bg-[radial-gradient(#c3c6d7_1px,transparent_1px)] [background-size:24px_24px]"></div>

			{/* Logo Header */}
			<div className="relative z-10 w-full flex items-center justify-center pt-space-sm">
				<div className="flex flex-col items-center">
					<div className="w-16 h-16 md:w-20 md:h-20 ">
						
					</div>
					<h1 className="font-headline-xl text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
						SOVEREIGN
					</h1>
					<p className="font-label-lg text-label-lg text-on-surface-variant tracking-widest uppercase mt-space-xs">
						The Marketplace
					</p>
				</div>
			</div>

			{/* Ambient Backdrop Aura */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-gradient-to-tr from-primary/20 via-secondary-container/30 to-transparent blur-3xl pointer-events-none rounded-full"></div>

			{/* Content */}
			<div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-margin-mobile md:px-margin py-space-xl">
				<div className="w-full max-w-md">
					{/* Header Section */}
					<div className="flex flex-col items-center mb-space-xl">
						<h2 className="font-headline-lg text-headline-lg text-on-surface text-center">
							Welcome Back
						</h2>
						<p className="font-body-md text-body-md text-on-surface-variant text-center mt-space-md max-w-sm">
							Sign in with your Google account to access your orders and manage
							your profile
						</p>
					</div>

					{/* Authentication Card */}
					<div className="bg-surface-container-lowest rounded-xl shadow-xl p-space-xl flex flex-col gap-space-lg relative overflow-hidden">
						{/* Google Auth Button */}
						<GoogleAuthButton onClick={handleGoogleAuth} isLoading={isLoading} />

						{/* Divider */}
						<div className="flex items-center gap-space-sm">
							<div className="flex-1 h-px bg-surface-container"></div>
							<div className="flex-1 h-px bg-surface-container"></div>
						</div>

						{/* Additional Info */}
						<div className="bg-surface-container-low rounded-lg p-space-md flex items-start gap-space-sm">
							<span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">
								info
							</span>
							<div className="flex flex-col gap-space-xs">
								<span className="font-label-md text-label-md text-on-surface font-semibold">
									Fast & Secure
								</span>
								<span className="font-body-sm text-body-sm text-on-surface-variant">
									Sign in with Google for instant access. No passwords to
									remember.
								</span>
							</div>
						</div>

						{/* Footer */}
						<LoginFooter />
					</div>
				</div>
			</div>
		</main>
	);
}

export default LoginPage;

function LoginFooter() {
	return (
		<div className="mt-space-lg pt-space-md bg-surface-container-lowest flex flex-col gap-2">
			<p className="font-label-sm text-label-sm text-on-surface-variant text-center leading-relaxed">
				By proceeding, you agree to our{" "}
				<a href="#terms" className="text-primary hover:underline font-semibold">
					Terms of Service
				</a>{" "}
				and{" "}
				<a href="#privacy" className="text-primary hover:underline font-semibold">
					Privacy Policy
				</a>
				. We only collect basic name, email, and profile information.
			</p>
			
		</div>
	);
}

export default LoginFooter;

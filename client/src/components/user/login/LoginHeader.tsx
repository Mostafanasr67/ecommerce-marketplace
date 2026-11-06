function LoginHeader() {
	return (
		<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md mb-space-md shadow-sm">
			<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
			<span>Secure Login Gateway</span>
			<span className="text-outline-variant font-bold">•</span>
			<span className="text-primary font-semibold">v2.4</span>
		</div>
	);
}

export default LoginHeader;

import { Link } from "react-router-dom";

function Footer() {
	return (
		<footer className="mt-space-xl bg-inverse-surface text-inverse-on-surface">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-space-md px-margin py-space-lg sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Link to="/home" className="font-headline-md text-title-md font-bold tracking-tight">
						SOVEREIGN
					</Link>
					<p className="mt-1 text-body-sm text-inverse-on-surface/70">
						A considered marketplace for everyday finds.
					</p>
				</div>

				<nav aria-label="Footer navigation" className="flex flex-wrap gap-space-lg">
					<Link to="/home" className="text-label-md font-medium text-inverse-on-surface/80 transition-colors hover:text-white">
						Home
					</Link>
					<Link to="/products" className="text-label-md font-medium text-inverse-on-surface/80 transition-colors hover:text-white">
						Shop products
					</Link>
				</nav>
			</div>
		</footer>
	);
}

export default Footer;

import { Link } from "react-router-dom";
import type { Address } from "../address/AddressHelper";

type ShippingAddressProps = {
	address: Address | null;
};

function ShippingAddress({ address }: ShippingAddressProps) {
	return (
		<section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-space-sm">
					<span className="h-6 w-2.5 rounded-full bg-primary" />
					<h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
						Shipping Address
					</h2>
				</div>
				<Link
					to="/address"
					className="rounded-md px-3 py-1.5 font-label-md text-label-md font-bold text-primary transition-colors hover:bg-primary/10"
				>
					Change
				</Link>
			</div>

			{address ? (
				<div className="flex flex-col gap-space-xs rounded-lg bg-surface-container-low p-space-md">
					<div className="flex items-center gap-space-sm">
						<span className="rounded bg-primary px-2 py-0.5 font-label-sm text-label-sm font-semibold tracking-wide text-on-primary">
							{address.label}
						</span>
						<span className="font-title-md text-title-md font-bold text-on-surface">
							{address.fullName}
						</span>
					</div>
					<p className="text-body-md text-on-surface-variant">
						{[address.building, address.street, address.apartment].filter(Boolean).join(", ")}
					</p>
					<p className="text-body-md text-on-surface-variant">
						{[address.area, address.city, address.country].filter(Boolean).join(", ")}
					</p>
					<p className="text-label-md text-outline">{address.phone}</p>
				</div>
			) : (
				<div className="flex items-center justify-between rounded-lg bg-surface-container-low p-space-md">
					<p className="text-body-md text-on-surface-variant">No shipping address selected.</p>
					<Link
						to="/address"
						className="rounded-md bg-primary px-space-lg py-space-sm font-label-md text-on-primary transition-colors hover:bg-primary-container"
					>
						Choose address
					</Link>
				</div>
			)}
		</section>
	);
}

export default ShippingAddress;

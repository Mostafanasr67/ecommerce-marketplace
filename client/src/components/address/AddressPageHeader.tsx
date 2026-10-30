function AddressPageHeader() {
	return (
		<div className="mb-space-lg flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
			<div>
				
				<h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
					Select Delivery Address
				</h1>
				<p className="mt-2 font-body-md text-body-md text-on-surface-variant">
					Choose where you want your order delivered, or add a new shipping
					address across Egypt.
				</p>
			</div>
		</div>
	);
}

export default AddressPageHeader;

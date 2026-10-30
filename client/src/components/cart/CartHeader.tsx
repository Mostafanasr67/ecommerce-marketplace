function CartHeader() {
	return (
		<div className="mb-space-lg flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
			<div>
				
				<h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
					Your Cart
				</h1>
				<p className="mt-2 font-body-md text-body-md text-on-surface-variant">
					Review the items in your cart and proceed to checkout.
				</p>
			</div>
		</div>
	);
}

export default CartHeader;

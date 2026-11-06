import type { Seller } from "../../../types/seller";

function SellerTopBar({ seller }: { seller: Seller }) {
	return (
		<header className="justify-end fixed left-72 right-0 top-0 z-40 flex h-20 items-center bg-surface-container-lowest/90 px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-md">
			

			<div className="ml-space-md flex items-center gap-space-lg">
				
				<div className="hidden items-center gap-space-sm sm:flex">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed font-label-md font-bold text-primary">
						{seller?.storeName?.[0]}
					</div>
					<div>
						<div className="flex items-center gap-1 font-label-md font-semibold text-on-surface">
							{seller?.storeName}
							<span className="material-symbols-outlined text-[16px] text-primary">verified</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

export default SellerTopBar;

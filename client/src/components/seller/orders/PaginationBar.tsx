interface PaginationBarProps {
	currentPage: number;
	totalPages: number;
	totalOrders: number;
	onPrevious: () => void;
	onNext: () => void;
}

function PaginationBar({
	currentPage,
	totalPages,
	totalOrders,
	onPrevious,
	onNext,
}: PaginationBarProps) {
	return (
		<div className="p-space-md bg-surface-container-low flex items-center justify-between">
			<div className="font-label-sm text-label-sm text-on-surface-variant">
				Page <span className="font-semibold text-on-surface">{currentPage}</span>{" "}
				of <span className="font-semibold text-on-surface">{totalPages}</span> ·{" "}
				<span className="text-on-surface">{totalOrders} Orders</span>
			</div>
			<div className="flex items-center gap-2">
				<button
					onClick={onPrevious}
					disabled={currentPage === 1}
					className="p-2 rounded-lg bg-surface-container-lowest text-outline hover:text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
				>
					<span className="material-symbols-outlined text-[18px]">
						chevron_left
					</span>
				</button>
				<button
					onClick={onNext}
					disabled={currentPage === totalPages}
					className="p-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
				>
					<span className="material-symbols-outlined text-[18px]">
						chevron_right
					</span>
				</button>
			</div>
		</div>
	);
}

export default PaginationBar;

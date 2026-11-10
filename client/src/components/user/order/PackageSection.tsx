import OrderItemRow from "./OrderItemRow";
import type { OrderItemView } from "./OrderItemRow";
import { TONE_STYLES } from "./orderTone";
import type { Tone } from "./orderTone";

type PackageSectionProps = {
	number: number;
	title: string;
	subtitle: string;
	etaLabel: string;
	eta: string;
	trackingCode: string;
	tone: Tone;
	items: OrderItemView[];
};

function PackageSection({
	number,
	title,
	subtitle,
	etaLabel,
	eta,
	trackingCode,
	tone,
	items,
}: PackageSectionProps) {
	const styles = TONE_STYLES[tone];

	return (
		<section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="-mx-space-lg -mt-space-lg flex flex-col justify-between gap-space-sm rounded-t-xl bg-surface-container-low p-space-md md:flex-row md:items-center">
				<div className="flex items-center gap-space-sm">
					<span className={`flex h-7 w-7 items-center justify-center rounded-lg font-label-md text-label-md font-bold ${styles.solid} ${styles.onSolid}`}>
						{number}
					</span>
					<div>
						<span className="font-label-lg text-label-lg font-bold text-on-surface">{title}</span>
						<span className="block font-label-sm text-label-sm text-on-surface-variant md:ml-space-sm md:inline">
							{subtitle}
						</span>
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-space-md font-label-md text-label-md">
					<span className="text-on-surface-variant">
						{etaLabel} <strong className="text-on-surface">{eta}</strong>
					</span>
					<span className={`rounded px-2 py-0.5 font-bold ${styles.soft}`}>Tracking: {trackingCode}</span>
				</div>
			</div>

			{items.map((item, index) => (
				<div key={item.id} className="flex flex-col gap-space-md">
					<OrderItemRow item={item} tone={tone} />
					{index < items.length - 1 && <div className="h-px w-full bg-surface-container-high" />}
				</div>
			))}
		</section>
	);
}

export default PackageSection;

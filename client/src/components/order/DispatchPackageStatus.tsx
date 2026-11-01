import OrderIcon from "./OrderIcon";
import type { IconName } from "./OrderIcon";
import { TONE_STYLES } from "./orderTone";
import type { Tone } from "./orderTone";

type DispatchPackageStatusProps = {
	icon: IconName;
	tone: Tone;
	title: string;
	trackingCode: string;
	etaLabel: string;
	eta: string;
	progressWidth: string;
	statusLabel: string;
};

function DispatchPackageStatus({
	icon,
	tone,
	title,
	trackingCode,
	etaLabel,
	eta,
	progressWidth,
	statusLabel,
}: DispatchPackageStatusProps) {
	const styles = TONE_STYLES[tone];

	return (
		<div className="rounded-xl bg-surface-container-low p-space-md">
			<div className="mb-1 flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<OrderIcon name={icon} className={`h-4 w-4 ${styles.text}`} />
					<span className="font-label-lg text-label-lg font-bold text-on-surface">{title}</span>
				</div>
				<span className={`rounded px-1.5 py-0.5 font-label-sm text-label-sm font-bold ${styles.soft}`}>
					{trackingCode}
				</span>
			</div>
			<p className="font-label-md text-label-md text-on-surface-variant">
				{etaLabel} <strong className="font-semibold text-on-surface">{eta}</strong>
			</p>
			<div className="mt-2 flex items-center gap-2">
				<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
					<div className={`h-full rounded-full ${styles.bar} ${progressWidth}`} />
				</div>
				<span className={`font-label-sm text-label-sm font-bold ${styles.text}`}>{statusLabel}</span>
			</div>
		</div>
	);
}

export default DispatchPackageStatus;

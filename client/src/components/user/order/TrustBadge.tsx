import OrderIcon from "./OrderIcon";
import type { IconName } from "./OrderIcon";

type TrustBadgeProps = {
	icon: IconName;
	title: string;
	subtitle: string;
};

function TrustBadge({ icon, title, subtitle }: TrustBadgeProps) {
	return (
		<div className="flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
			<OrderIcon name={icon} className="h-6 w-6 text-primary" />
			<div className="flex flex-col">
				<span className="font-label-md text-label-md font-bold leading-tight text-on-surface">
					{title}
				</span>
				<span className="font-label-sm text-label-sm text-outline">{subtitle}</span>
			</div>
		</div>
	);
}

export default TrustBadge;

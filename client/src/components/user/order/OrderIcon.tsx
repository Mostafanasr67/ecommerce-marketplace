import type { ReactNode } from "react";

const ICONS = {
	verified: (
		<>
			<path d="M12 2l2.4 2.1 3.2-.3.8 3.1 2.8 1.6-1.2 3 1.2 3-2.8 1.6-.8 3.1-3.2-.3L12 22l-2.4-2.1-3.2.3-.8-3.1-2.8-1.6 1.2-3-1.2-3 2.8-1.6.8-3.1 3.2.3z" />
			<path d="M8.5 12l2.5 2.5 4.5-4.5" />
		</>
	),
	shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
	lock: (
		<>
			<rect x="5" y="11" width="14" height="10" rx="2" />
			<path d="M8 11V7a4 4 0 018 0v4" />
		</>
	),
	gavel: (
		<>
			<path d="M14.5 4.5l5 5M12 7l5 5" />
			<path d="M3 21l7-7M7 15l-3 3" />
			<path d="M9 9l6 6" />
		</>
	),
	download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
	truck: (
		<>
			<rect x="1" y="6" width="13" height="10" rx="1" />
			<path d="M14 10h4l3 3v3h-7" />
			<circle cx="5.5" cy="18" r="2" />
			<circle cx="17.5" cy="18" r="2" />
		</>
	),
	arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
	home: <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" />,
	phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 006 6L16 14l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
	navigation: <path d="M3 11l18-8-8 18-2-8z" />,
	edit: <path d="M4 20h4L19 9l-4-4L4 16z" />,
	wallet: (
		<>
			<rect x="3" y="6" width="18" height="13" rx="2" />
			<path d="M16 12h2M3 10h18" />
		</>
	),
	route: (
		<>
			<circle cx="6" cy="5" r="2" />
			<circle cx="18" cy="19" r="2" />
			<path d="M6 7v4a4 4 0 004 4h4a4 4 0 014 4" />
		</>
	),
	zap: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
	factory: <path d="M3 21V10l5 3V10l5 3V5h4v16z" />,
	info: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 11v5M12 8h.01" />
		</>
	),
	receipt: (
		<>
			<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" />
			<path d="M9 8h6M9 12h6" />
		</>
	),
	ticket: <path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4z" />,
	tag: (
		<>
			<path d="M3 12V4h8l10 10-8 8z" />
			<circle cx="7.5" cy="8.5" r="1" />
		</>
	),
	headset: (
		<>
			<path d="M4 14v-2a8 8 0 0116 0v2" />
			<rect x="3" y="14" width="4" height="6" rx="1" />
			<rect x="17" y="14" width="4" height="6" rx="1" />
		</>
	),
	refresh: (
		<>
			<path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8" />
			<path d="M3 3v5h5" />
		</>
	),
	clock: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7v5l3 2" />
		</>
	),
	leaf: <path d="M5 19c0-8 6-13 14-14-1 8-6 14-14 14zM5 19l7-7" />,
} satisfies Record<string, ReactNode>;

type IconName = keyof typeof ICONS;

type OrderIconProps = {
	name: IconName;
	className?: string;
};

function OrderIcon({ name, className = "h-5 w-5" }: OrderIconProps) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`shrink-0 ${className}`}
		>
			{ICONS[name]}
		</svg>
	);
}

export type { IconName };
export default OrderIcon;

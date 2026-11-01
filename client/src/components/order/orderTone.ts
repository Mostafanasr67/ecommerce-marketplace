export type Tone = "primary" | "secondary";

export const TONE_STYLES: Record<
	Tone,
	{ text: string; solid: string; onSolid: string; soft: string; bar: string }
> = {
	primary: {
		text: "text-primary",
		solid: "bg-primary",
		onSolid: "text-on-primary",
		soft: "bg-primary/10 text-primary",
		bar: "bg-primary",
	},
	secondary: {
		text: "text-secondary",
		solid: "bg-secondary",
		onSolid: "text-on-secondary",
		soft: "bg-secondary/10 text-secondary",
		bar: "bg-secondary",
	},
};

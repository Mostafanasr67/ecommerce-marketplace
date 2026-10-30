const shipmentImages = [
	{
		alt: "Wireless over-ear headphones on a white podium",
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE_HQNJRjcXuTaifvifIpHBxfSA81YoCxgCtPw-gHljk4FCoj7Zh2BKDOLdqoLjppZLciUa3fc8gfgMcZXTmev7CJoYSoalcRbSIUzQQG3BiiIvZObO9uNInUmky3Rz01skqp5CpfZpzKEa4PqO014IxHjMi1qECgXvoOPg206tqrxEe5suwdPGbPGS4t9ED_L7QBHKIrMb7CpflKlptohz63C9Ypac2iaH3oW6n0",
	},
	{
		alt: "Nylon headphone travel case",
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQWP7OEgctC8RxMP04nYTjEsaytE7qnnwJUfNbTUdwUuBv8tdEtcqmS47cAmS5rgaX3OOlMjgt6vH3jMpcAdiri-OXEqF2qnUrnEwTIVhObE0KMdAcmRKJAfLm-3lRzAXMmCqn4lZ4cb6DBi635DrgbuYIMziHPXw-rRUxUh-L7TBwuqrLSl5JzuS93TAVHWSA6_E68e3XCmAx9QmynxnZKtmTJNrp7xcZSOc_BSY",
	},
	{
		alt: "Folded heather gray hoodie",
		src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgyeuT801LyIEcjDgoU8q_lmpV2KopRu2Fxpxe3ihJdEtMN4Mi_xXjXMJKWi2M8awZmLlwsLgr3mj5O0Tqlv-nSKsVSVf0hDYWmN5Mh1KbETekLQfod-q-zCz0RoTav03EiDqRPVXrV_9Ei9oc60eJJVvJTRqvvyuGuNl81UCRj3z1-HCpB2rJ9ZtkYNML1kHVPX5rWAH21M4-vlSSEWp1W5W0QqfLqGxsQGvET_U",
	},
];

function ShipmentPreview() {
	return (
		<section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-container-low p-space-sm">
				<div className="flex items-center gap-space-sm">
					{shipmentImages.map((image) => (
						<div
							key={image.alt}
							className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-surface-container-lowest shadow-sm"
						>
							<img
								src={image.src}
								alt={image.alt}
								className="h-full w-full object-cover"
							/>
						</div>
					))}
				</div>
				<div className="min-w-0 flex-1 pl-space-xs">
					<span className="block font-label-sm text-label-sm text-outline">
						Shipment
					</span>
					<span className="block truncate font-label-md text-label-md font-bold text-on-surface">
						AuraSound, Case + 1 more
					</span>
				</div>
			</div>
		</section>
	);
}

export default ShipmentPreview;

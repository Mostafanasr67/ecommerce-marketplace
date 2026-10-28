const recommendations = [
	{
		name: "Braided Audiophile Extension Cable",
		price: 249,
		image:
			"https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80",
	},
	{
		name: "Premium Leather Cable Organizer",
		price: 175,
		image:
			"https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=400&q=80",
	},
	{
		name: "Compact Multi-Port Travel Charger",
		price: 599,
		image:
			"https://images.unsplash.com/photo-1609592424758-0a6e2b9f4b77?auto=format&fit=crop&w=400&q=80",
	},
];

function CartRecommendations() {
	return (
		<section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div>
				<h2 className="text-title-md font-bold text-on-surface">
					Frequently Added With These Items
				</h2>
				<p className="text-body-sm text-on-surface-variant">
					Complement your setup with zero additional delivery delay
				</p>
			</div>

			<div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
				{recommendations.map((recommendation) => (
					<article
						key={recommendation.name}
						className="flex flex-col justify-between gap-space-sm rounded-xl bg-surface-container-low p-space-md transition-shadow hover:shadow-md"
					>
						<div className="h-32 overflow-hidden rounded-lg bg-surface-container-lowest">
							<img
								src={recommendation.image}
								alt={recommendation.name}
								className="h-full w-full object-cover"
							/>
						</div>
						<h3 className="text-label-lg font-bold text-on-surface">
							{recommendation.name}
						</h3>
						<div className="flex items-center justify-between gap-space-sm">
							<span className="text-price-sm text-on-surface">
								{recommendation.price.toLocaleString("en-EG")} EGP
							</span>
							<button
								type="button"
								className="rounded-lg bg-primary px-space-md py-space-sm text-label-md font-bold text-on-primary transition-colors hover:bg-primary-container"
							>
								Add
							</button>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}

export default CartRecommendations;

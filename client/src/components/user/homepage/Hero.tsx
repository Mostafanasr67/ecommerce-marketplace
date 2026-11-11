function Hero({ onCategorySelect }: { onCategorySelect: (categoryId: string) => void }) {
	return (
		<section className="mx-auto w-full max-w-7xl px-margin pt-space-lg">
			<div className="relative isolate overflow-hidden rounded-3xl border border-outline-variant/60 bg-gradient-to-br from-primary-fixed/70 via-surface-container-lowest to-surface-container-low px-space-lg py-space-xl shadow-lg shadow-on-surface/5 sm:px-12 sm:py-14 lg:min-h-[360px] lg:px-16 lg:py-20">
				<div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-36 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-3xl" />

				<div className="relative z-10 max-w-2xl">
					<p className="mb-space-lg inline-flex items-center rounded-full border border-primary/15 bg-surface-container-lowest/90 px-space-md py-space-xs font-label-sm font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
						Curated for you
					</p>

					<h1 className="max-w-xl font-headline-xl text-4xl font-bold leading-[1.08] tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
						Find something <span className="text-primary">wonderful.</span>
					</h1>

					<p className="mt-space-md max-w-lg text-body-lg leading-relaxed text-on-surface-variant">
						Thoughtful finds for your home, your style, and everything in between.
					</p>

					<div className="mt-space-xl flex flex-wrap items-center gap-space-md">
						<button
							type="button"
							onClick={() => onCategorySelect("Deals")}
							className="inline-flex h-12 items-center gap-space-sm rounded-xl bg-primary px-space-lg font-label-md font-semibold text-on-primary shadow-sm transition hover:bg-primary-container hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						>
							Explore seasonal deals
							<span className="material-symbols-outlined text-lg" aria-hidden="true">arrow_forward</span>
						</button>
						
					</div>
				</div>

			</div>
		</section>
	);
}

export default Hero;

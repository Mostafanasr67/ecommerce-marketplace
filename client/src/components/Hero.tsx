
import PromoTiles from "./PromoTiles"

function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-space-lg px-margin pt-space-lg lg:grid-cols-12">
      <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm md:p-space-xl lg:col-span-8">
        {/* Decorative background effects */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-fixed/40 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-secondary-container/30 blur-3xl" />

        {/* Main promotional content */}
        <div className="relative z-10 max-w-xl">
          <div className="mb-space-md inline-flex items-center gap-space-xs rounded-full bg-surface-container px-space-sm py-1">
            <span className="text-primary">✓</span>
            <span className="text-label-sm uppercase tracking-wide text-primary">
              Sovereign Direct Escrow • Greater Cairo Hub
            </span>
          </div>

          <h1 className="mb-space-sm text-headline-xl font-extrabold leading-tight tracking-tight text-on-surface">
            Upgrade Your Everyday Tech & Style
          </h1>

          <p className="mb-space-lg max-w-lg text-body-md leading-relaxed text-on-surface-variant">
            Shop genuine goods from 4,500+ verified independent sellers across
            Egypt. Enjoy fast local delivery, strict authenticity guarantees,
            and hassle-free returns.
          </p>

          <div className="mb-space-xl flex flex-wrap items-center gap-space-md">
            <a
              href="#featured-catalog"
              className="inline-flex h-11 items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary transition-colors hover:bg-primary-container"
            >
              Explore Trending Deals <span>→</span>
            </a>

            <a
              href="#sellers-spotlight"
              className="inline-flex h-11 items-center gap-space-xs rounded-xl bg-surface-container px-space-lg text-label-lg text-on-surface transition-colors hover:bg-surface-container-high"
            >
              <span className="text-primary">▣</span>
              Discover Verified Sellers
            </a>
          </div>
        </div>

        {/* Trust information */}
        <div className="relative z-10 mt-space-md flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-low/70 p-space-md sm:flex-row sm:items-center">
          <div className="flex items-center gap-space-md">
            <div className="flex -space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-highest text-label-sm font-bold text-primary">
                EG
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-fixed text-label-sm font-bold text-on-primary-fixed">
                CA
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-label-sm font-bold text-on-secondary-fixed">
                GZ
              </div>
            </div>

            <div>
              <div className="text-label-md font-bold text-on-surface">
                ★★★★★ 4.9 / 5
              </div>
              <p className="text-label-sm text-outline">
                From 120k+ verified orders in Egypt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-xs self-start rounded-lg bg-surface-container-lowest px-space-sm py-1 sm:self-auto">
            <span className="text-primary">✓</span>
            <span className="text-label-sm font-bold text-on-surface">
              100% Genuine Certified
            </span>
          </div>
        </div>
      </div>
      
      <PromoTiles />
    </section>
  )
}

export default Hero

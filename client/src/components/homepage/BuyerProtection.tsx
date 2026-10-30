
const protections = [
  {
    icon: '🔒',
    title: 'Secure Payments',
    description:
      'Your payment information is protected throughout checkout.',
  },
  {
    icon: '✓',
    title: 'Verified Sellers',
    description:
      'We work to ensure sellers meet our marketplace standards.',
  },
  {
    icon: '↩',
    title: 'Buyer Protection',
    description:
      'Clear return policies help you shop with greater confidence.',
  },
]

function BuyerProtection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-margin py-space-xl">
      <div className="rounded-xl bg-surface-container-low p-space-xl md:p-10">
        <div className="mx-auto mb-space-xl max-w-2xl text-center">
          <p className="mb-space-sm text-label-sm font-bold uppercase tracking-wider text-primary">
            Shop with confidence
          </p>

          <h2 className="text-headline-md font-bold text-on-surface">
            Your Trust Comes First
          </h2>

          <p className="mt-space-sm text-body-md text-on-surface-variant">
            We're building a marketplace where discovering great products
            feels safe, simple, and reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
          {protections.map((protection) => (
            <article
              key={protection.title}
              className="rounded-xl bg-surface-container-lowest p-space-lg text-center"
            >
              <span className="mx-auto mb-space-md flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed text-2xl text-primary">
                {protection.icon}
              </span>

              <h3 className="mb-space-sm text-title-md font-bold text-on-surface">
                {protection.title}
              </h3>

              <p className="text-body-sm text-on-surface-variant">
                {protection.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BuyerProtection

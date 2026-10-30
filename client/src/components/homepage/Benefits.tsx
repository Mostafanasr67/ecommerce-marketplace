
const benefits = [
  {
    icon: '🚚',
    title: 'Fast Express Delivery',
    description: 'Same-day delivery in Greater Cairo and Giza.',
  },
  {
    icon: '✓',
    title: '100% Authentic',
    description: 'Verified sellers and genuine products.',
  },
  {
    icon: '💳',
    title: 'Flexible Payments',
    description: 'Pay your way with secure payment options.',
  },
  {
    icon: '↩',
    title: 'Easy 14-Day Returns',
    description: 'Simple returns for a worry-free purchase.',
  },
]

function Benefits() {
  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-space-md px-margin py-space-xl sm:grid-cols-2 lg:grid-cols-4">
      {benefits.map((benefit) => (
        <article
          key={benefit.title}
          className="flex items-start gap-space-md rounded-xl bg-surface-container-low p-space-lg"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-xl">
            {benefit.icon}
          </span>

          <div>
            <h2 className="mb-space-xs text-title-md font-bold text-on-surface">
              {benefit.title}
            </h2>

            <p className="text-body-sm text-on-surface-variant">
              {benefit.description}
            </p>
          </div>
        </article>
      ))}
    </section>
  )
}

export default Benefits

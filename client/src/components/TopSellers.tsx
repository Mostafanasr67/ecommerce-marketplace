
const sellers = [
  {
    id: 1,
    name: 'Tech Haven',
    category: 'Electronics & Gadgets',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    products: 124,
  },
  {
    id: 2,
    name: 'Urban Steps',
    category: 'Fashion & Footwear',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80',
    rating: 4.8,
    products: 86,
  },
  {
    id: 3,
    name: 'Cairo Crafts',
    category: 'Egyptian Handmade Goods',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    products: 52,
  },
]

function TopSellers() {
  return (
    <section className="mx-auto w-full max-w-7xl px-margin py-space-xl">
      <div className="mb-space-lg flex items-end justify-between gap-space-md">
        <div>
          <p className="mb-space-xs text-label-sm font-bold uppercase tracking-wider text-primary">
            Meet our vendors
          </p>

          <h2 className="text-headline-md font-bold text-on-surface">
            Top Sellers
          </h2>

          <p className="mt-space-sm text-body-md text-on-surface-variant">
            Discover trusted stores from across the marketplace.
          </p>
        </div>

        <a
          href="#"
          className="shrink-0 text-label-md font-semibold text-primary hover:underline"
        >
          Explore all →
        </a>
      </div>

      <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-3">
        {sellers.map((seller) => (
          <article
            key={seller.id}
            className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md"
          >
            <img
              src={seller.image}
              alt={`${seller.name} store`}
              className="h-44 w-full object-cover"
            />

            <div className="p-space-lg">
              <div className="mb-space-sm flex items-start justify-between gap-space-sm">
                <div>
                  <h3 className="text-headline-sm font-bold text-on-surface">
                    {seller.name}
                  </h3>

                  <p className="mt-space-xs text-body-sm text-on-surface-variant">
                    {seller.category}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-secondary-container px-space-sm py-1 text-label-sm font-semibold text-on-secondary-container">
                  ✓ Verified
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-outline-variant pt-space-md">
                <span className="text-label-md text-on-surface-variant">
                  ★ {seller.rating} rating
                </span>

                <span className="text-label-md font-semibold text-on-surface">
                  {seller.products} products
                </span>
              </div>

              <button
                type="button"
                className="mt-space-md w-full rounded-lg border border-outline-variant px-space-md py-space-sm text-label-md font-semibold text-primary transition-colors hover:bg-surface-container-low"
              >
                Visit Store →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TopSellers


const categories = [
  {
    name: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Home & Living',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Beauty',
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Sports',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=500&q=80',
  },
]

function Categories() {
  return (
    <section
      id="category-section"
      className="mx-auto w-full max-w-7xl px-margin py-space-xl"
    >
      <div className="mb-space-lg flex items-end justify-between">
        <div>
          <p className="mb-space-xs text-label-sm font-bold uppercase tracking-wider text-primary">
            Explore the marketplace
          </p>

          <h2 className="text-headline-md font-bold text-on-surface">
            Shop by Category
          </h2>
        </div>

        <a
          href="#featured-catalog"
          className="text-label-md font-semibold text-primary hover:underline"
        >
          View all →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-space-md sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <a
            key={category.name}
            href="#featured-catalog"
            className="group overflow-hidden rounded-xl bg-surface-container-low transition-transform hover:-translate-y-1"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h3 className="p-space-md text-center text-label-md font-bold text-on-surface">
              {category.name}
            </h3>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Categories

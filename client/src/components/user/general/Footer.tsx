
const footerGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '#featured-catalog' },
      { label: 'Categories', href: '#category-section' },
      { label: 'Top Sellers', href: '#' },
      { label: 'Recently Added', href: '#' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'Contact Us', href: 'mailto:support@sovereign.example' },
      { label: 'Shipping & Delivery', href: '#' },
      { label: 'Returns & Refunds', href: '#' },
      { label: 'FAQs', href: '#' },
    ],
  },
  {
    title: 'Sell on Sovereign',
    links: [
      { label: 'Become a Seller', href: '#' },
      { label: 'Seller Guidelines', href: '#' },
      { label: 'Seller Dashboard', href: '#' },
    ],
  },
]

function Footer() {
  return (
    <footer className="mt-space-xl bg-inverse-surface text-inverse-on-surface">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-space-xl px-margin py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a
            href="#"
            className="text-headline-md font-extrabold tracking-tight"
          >
            SOVEREIGN
          </a>

          <p className="mt-space-md max-w-xs text-body-sm text-surface-variant">
            Discover exceptional products from trusted sellers across Egypt.
          </p>

          <p className="mt-space-md text-label-sm text-surface-variant">
            Shop smarter. Shop Sovereign.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h2 className="mb-space-md text-title-md font-bold">
              {group.title}
            </h2>

            <ul className="flex flex-col gap-space-sm">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-body-sm text-surface-variant transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-outline-variant/30">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-space-md px-margin py-space-lg text-label-sm text-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sovereign. All rights reserved.</p>

          <div className="flex flex-wrap gap-space-md">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Fawry</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

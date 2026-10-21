
function PromoTiles() {
  return (
    <div className="flex flex-col gap-space-lg lg:col-span-4">
      {/* Electronics promotion */}
      <article className="flex flex-1 flex-col justify-between rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
        <div>
          <div className="mb-space-sm flex items-center justify-between gap-space-sm">
            <span className="rounded-full bg-error px-space-sm py-1 text-label-sm font-bold uppercase text-on-error">
              Limited Offer
            </span>
            <span className="text-label-sm font-bold text-error">
              ⚡ Flash Deal
            </span>
          </div>

          <h2 className="mb-space-xs text-headline-sm font-bold text-on-surface">
            Mega Electronics Week
          </h2>

          <p className="mb-space-md text-body-sm text-on-surface-variant">
            Save up to 40% on wireless headphones, smart wearables, and gaming
            essentials.
          </p>
        </div>

        <div className="flex items-end justify-between gap-space-md">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ8Oc4I-nVeb2vONQ6ZwzSdoVVKlwdRepJB1HpfgaMvUYS0qaXhkGLJk-aB12Xjl_VyFzSVkh8enMn_9KTgxtkYwHxe8QbsFXFa7GXsxPd-0XvDAsQ5oTu6fE9kdQVClKr1Wu_RvHD4Zatnfq1agEtT8HiWYWye2z5zTDLRND-zFuxMUTpsfTqr_MpxrfGdaO5GQOPCXZ0n40eQS5BgzVoKCuQtT_q6giVbZQjKnPVM1bLLQrSsJfl"
            alt="Premium wireless headphones"
            className="h-24 w-28 rounded-lg bg-surface-container-low object-cover"
          />

          <a
            href="#featured-catalog"
            className="rounded-lg bg-surface-container-high px-space-md py-space-sm text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
          >
            Shop Sale →
          </a>
        </div>
      </article>

      {/* Local artisan promotion */}
      <article className="flex flex-1 flex-col justify-between rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
        <div>
          <div className="mb-space-sm flex items-center justify-between gap-space-sm">
            <span className="rounded-full bg-secondary-container px-space-sm py-1 text-label-sm font-bold uppercase text-on-secondary-container">
              Local Heritage
            </span>
            <span className="text-label-sm text-outline">
              Handmade in Egypt
            </span>
          </div>

          <h2 className="mb-space-xs text-headline-sm font-bold text-on-surface">
            Artisan Home & Living
          </h2>

          <p className="mb-space-md text-body-sm text-on-surface-variant">
            Discover handmade decor and beautiful pieces from workshops across
            Egypt.
          </p>
        </div>

        <div className="flex items-end justify-between gap-space-md">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtRasFwLFNCQuJWy-KZyJlfCYDQ8y969T1tZDgX3-09qegD29WrJK5xUBF_T_DqamOc_AO7eql6K-gGdWQtVB2ix8k1UlXj_tGCnSiAK6fD0aczm1uWxBB8_p6ULAxVFpVK5TCnHAtzEYFMvXsTLoZQN0K3CSGazfZIcB28ObiqHT9wvPo3lCnemmwLReciT79u_uc5EY-dDq0IEqgITsCq3Q-POizxYhL4GnHa5s8_NfCQLRE3482"
            alt="Handcrafted ceramic vase and wooden serving bowl"
            className="h-24 w-28 rounded-lg bg-surface-container-low object-cover"
          />

          <a
            href="#category-section"
            className="rounded-lg bg-primary px-space-md py-space-sm text-label-md font-semibold text-on-primary transition-colors hover:bg-primary-container"
          >
            Explore Collection →
          </a>
        </div>
      </article>
    </div>
  )
}

export default PromoTiles

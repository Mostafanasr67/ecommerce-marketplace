import OrderIcon from "./OrderIcon";
import PackageSection from "./PackageSection";

function PurchasedItems() {
	return (
		<section className="flex flex-col gap-space-lg">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-headline-md text-headline-md font-bold text-on-surface">
						Purchased Items in this Order (3 Items)
					</h2>
					<p className="font-body-sm text-body-sm text-on-surface-variant">
						Fulfilled transparently by verified merchants with escrow settlement hold.
					</p>
				</div>
				<span className="hidden items-center gap-1.5 rounded-lg bg-surface-container px-space-md py-1 font-label-md text-label-md font-semibold text-on-surface sm:inline-flex">
					<OrderIcon name="shield" className="h-4 w-4 text-primary" />
					All Items Genuine Certified
				</span>
			</div>

			<PackageSection
				number={1}
				title="Package 1: Fulfilled by Sovereign Express Hub"
				subtitle="Express 24h Cairo & Giza Fleet"
				etaLabel="Delivery:"
				eta="Tomorrow by 2:00 PM"
				trackingCode="SVX-CAI-99210"
				tone="primary"
				items={[
					{
						image:
							"https://lh3.googleusercontent.com/aida-public/AB6AXuAi34U2M_puHIUvxlEUlLFpmNdXflXu5zpN9XWsjSn44LIQgU6i-Sjq2ug_pg_aNemxyFjFajI48EpL4AdpLkpODehWxT6AoX_-KDYv7Lv7q1FEYne9PC8xYSvnIDKefvAIVLGJsj9j6Pbwg4MEehtYml-GYM3eW0DwznxFbBAGqoT3iqCV5QwfhIwrQTuOveIu6iRMLztGLBLWZ5odmLKyh_vmz3ZReCz_GaR-jOc",
						sellerName: "Sold by TechElite Official (Cairo Express Hub)",
						sellerIcon: "shield",
						name: "AuraSound ANC Wireless Over-Ear Headphones",
						details:
							"Active Noise Cancellation • 40h Battery • Midnight Navy • 2-Year Official Agency Warranty",
						highlightIcon: "verified",
						highlight: "Sovereign Escrow Protection Included",
						quantity: 1,
						price: "3,499 EGP",
						originalPrice: "3,999 EGP",
					},
					{
						image:
							"https://lh3.googleusercontent.com/aida-public/AB6AXuCnytAyMLAu2Fh0l2nbvO13JbeQri3Lwzg6VzXQQTal45rn8nddSwVI-Hfk6tMxm_x-REh26P8j2dYP8M6WM8796a4Zd-MTwGC9NMJOzc3X6o1xFjblzrmZ_6E4tHvuJADyWyav0wlDqyFAqlr3rbz5Gx3kW-20V5HJs0S-eQcQhTHQ8PwNcK_jLqtfqfq9JpCZI_HS5iPAcWZzXZu7iwP9tHXpii-A3no8Qc3qtu0",
						sellerName: "Sold by TechElite Official",
						sellerIcon: "shield",
						name: "Pro Travel Hard EVA Armor Case for AuraSound",
						details: "Matte Black • Shockproof Interior Foam Lining • Splash-Resistant Shell",
						quantity: 1,
						price: "390 EGP",
						originalPrice: "450 EGP",
					},
				]}
			/>

			<PackageSection
				number={2}
				title="Package 2: Direct Merchant Fulfillment (Artisan Guild)"
				subtitle="Dispatched directly from Alexandria Workshop"
				etaLabel="Estimated:"
				eta="Within 2–3 Business Days"
				trackingCode="CAL-ALX-48201"
				tone="secondary"
				items={[
					{
						image:
							"https://lh3.googleusercontent.com/aida-public/AB6AXuCv7wIX9ubV391POCHM39zht6OM7T_BRUox8yT1KJ71wtAqOrsqKpeFNHVwGsF5PEd2FZxHVNUAF18oqCi_4pqX45ZUywf6X1pMwrGy6Lbs8DbMMDFCaZHznH7pR6_N17U5EcjKfZQqOXRjSpund0ms6a4XWclcOWeHXtHmYZjGwlV_oSKSn6M88od71D5p4ePx_vc3ZN9Wat9I2CULJ3UK3BmiWRWmHY0OfZcR2rE",
						sellerName: "Sold by Cairo Apparel Lab (Direct Artisan)",
						sellerIcon: "verified",
						name: "NileLoom 100% Egyptian Cotton Minimalist Heavyweight Hoodie",
						details: "Color: Sand Dune • Size: L Regular Fit • Pre-Shrunk 450 GSM French Terry",
						highlightIcon: "leaf",
						highlight: "Authentic Giza Long-Staple Cotton",
						quantity: 1,
						price: "1,150 EGP",
						originalPrice: "1,290 EGP",
					},
				]}
			/>
		</section>
	);
}

export default PurchasedItems;

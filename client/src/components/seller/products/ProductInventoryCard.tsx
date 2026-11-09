import { useState } from "react";
import type { FormEvent } from "react";
import type { SellerProduct } from "../../../types/seller";
import type { ProductCategory, SellerProductDetails } from "../../../pages/seller/SellerHelper";

interface ProductInventoryCardProps {
	product: SellerProduct;
	categories: ProductCategory[];
	categoriesLoading: boolean;
	onSaveStock: (productId: string, expectedStock: number, stock: number) => Promise<void>;
	onSaveDetails: (productId: string, details: SellerProductDetails) => Promise<void>;
}

function ProductInventoryCard({ product, categories, categoriesLoading, onSaveStock, onSaveDetails }: ProductInventoryCardProps) {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState("");
	const [expectedStock, setExpectedStock] = useState(product.stock);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [editingDetails, setEditingDetails] = useState(false);
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [categoryId, setCategoryId] = useState(product.categoryId);
	const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED" | "NONE">("NONE");
	const [discountValue, setDiscountValue] = useState("");
	const [expectedUpdatedAt, setExpectedUpdatedAt] = useState("");
	const image = product.productImages.find((item) => item.url.trim());
	const stockLabel = product.stock === 0 ? "Out of stock" : product.stock < 10 ? "Low stock" : "In stock";

	function startEditing() {
		setValue(String(product.stock));
		setExpectedStock(product.stock);
		setError(null);
		setEditing(true);
	}

	function startEditingDetails() {
		setName(product.name);
		setPrice(product.price);
		setCategoryId(product.categoryId);
		setDiscountType(product.discountType ?? "NONE");
		setDiscountValue(product.discountValue ?? "");
		setExpectedUpdatedAt(product.updatedAt);
		setError(null);
		setEditingDetails(true);
	}

	async function handleDetailsSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const numericPrice = Number(price);
		const numericDiscount = Number(discountValue);
		const validAmount = (value: string) => /^\d+(\.\d{1,2})?$/.test(value) && Number(value) > 0 && Number(value) <= 1000000000;
		if (!name.trim() || !validAmount(price) || (discountType !== "NONE" &&
			(!validAmount(discountValue) || numericDiscount >= (discountType === "PERCENT" ? 100 : numericPrice)))) {
			setError("Enter a name, a positive price, and a valid discount with at most two decimal places.");
			return;
		}
		setSaving(true);
		setError(null);
		try {
			await onSaveDetails(product.id, {
				name: name.trim(), price: numericPrice, categoryId, expectedUpdatedAt,
				discountType: discountType === "NONE" ? null : discountType,
				discountValue: discountType === "NONE" ? null : numericDiscount,
			});
			setEditingDetails(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update product.");
		} finally {
			setSaving(false);
		}
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!/^\d+$/.test(value) || Number(value) > 2147483647) {
			setError("Enter a whole number between 0 and 2,147,483,647.");
			return;
		}
		const stock = Number(value);
		if (stock === expectedStock) {
			setEditing(false);
			return;
		}
		setError(null);
		setSaving(true);
		try {
			await onSaveStock(product.id, expectedStock, stock);
			setEditing(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update stock.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<article className="flex flex-col gap-space-md rounded-xl border border-surface-container bg-surface-container-lowest p-space-md shadow-sm">
			<div className="flex flex-col gap-space-md sm:flex-row sm:items-center">
			<div className="flex min-w-0 flex-1 items-center gap-space-md">
				{image ? (
					<img src={image.url} alt={image.altText || product.name} className="h-20 w-20 shrink-0 rounded-lg bg-surface-container object-cover" />
				) : (
					<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-outline">
						<span className="material-symbols-outlined" aria-hidden="true">inventory_2</span>
					</div>
				)}
				<div className="min-w-0">
					<h2 className="break-words font-title-md text-title-md font-semibold text-on-surface">{product.name}</h2>
					<p className="mt-1 font-body-sm text-on-surface-variant">{product.category.name}</p>
					<p className="mt-2 font-label-md font-semibold text-on-surface">{Number(product.price).toLocaleString("en-EG", { maximumFractionDigits: 2 })} EGP</p>
					{product.discountType && <p className="mt-1 font-label-sm text-on-surface-variant">Discount: {product.discountValue}{product.discountType === "PERCENT" ? "%" : " EGP"}</p>}
				</div>
			</div>
			<div className="sm:w-72 sm:shrink-0">
				<div className="flex items-center justify-between gap-space-md">
					<div>
						<p className="font-label-sm text-on-surface-variant">{stockLabel}</p>
						<p className="mt-1 font-label-lg font-semibold text-on-surface">{product.stock.toLocaleString("en-EG")} units</p>
					</div>
					{!editing && !editingDetails && (
						<div className="flex gap-2">
						<button type="button" onClick={startEditing} className="cursor-pointer rounded-lg border border-outline-variant px-4 py-2 font-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
							Edit stock
						</button>
						<button type="button" onClick={startEditingDetails} className="cursor-pointer rounded-lg border border-outline-variant px-4 py-2 font-label-md font-semibold text-on-surface hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-primary">Edit details</button>
						</div>
					)}
				</div>
				</div>
				{editingDetails && (
					<form onSubmit={handleDetailsSubmit} className="grid gap-space-md border-t border-surface-container pt-space-md sm:grid-cols-2">
						<label className="flex flex-col gap-1 font-label-sm">Product name
							<input required value={name} onChange={(event) => setName(event.target.value)} disabled={saving} className="rounded-lg border border-outline-variant px-3 py-2 font-body-md" />
						</label>
						<label className="flex flex-col gap-1 font-label-sm">Regular price (EGP)
							<input type="number" min="0.01" step="0.01" required value={price} onChange={(event) => setPrice(event.target.value)} disabled={saving} className="rounded-lg border border-outline-variant px-3 py-2 font-body-md" />
						</label>
						<label className="flex flex-col gap-1 font-label-sm">Category
							<select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} disabled={saving || categoriesLoading} className="rounded-lg border border-outline-variant px-3 py-2 font-body-md">
								{!categories.some((category) => category.id === product.categoryId) && <option value={product.categoryId}>{product.category.name}</option>}
								{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
							</select>
						</label>
						<label className="flex flex-col gap-1 font-label-sm">Discount
							<select value={discountType} onChange={(event) => {
								const value = event.target.value;
								if (value === "NONE" || value === "PERCENT" || value === "FIXED") setDiscountType(value);
							}} disabled={saving} className="rounded-lg border border-outline-variant px-3 py-2 font-body-md">
								<option value="NONE">No discount</option>
								<option value="PERCENT">Percentage off</option>
								<option value="FIXED">Amount off (EGP)</option>
							</select>
						</label>
						{discountType !== "NONE" && <label className="flex flex-col gap-1 font-label-sm">Discount {discountType === "PERCENT" ? "(%)" : "(EGP)"}
							<input type="number" min="0.01" step="0.01" required value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} disabled={saving} className="rounded-lg border border-outline-variant px-3 py-2 font-body-md" />
						</label>}
						{error && <p role="alert" className="font-body-sm text-error sm:col-span-2">{error}</p>}
						<div className="flex gap-2 sm:col-span-2">
							<button type="submit" disabled={saving} className="cursor-pointer rounded-lg bg-on-surface px-4 py-2 font-label-md font-semibold text-surface-container-lowest disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
							<button type="button" disabled={saving} onClick={() => setEditingDetails(false)} className="cursor-pointer rounded-lg px-4 py-2 font-label-md text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50">Cancel</button>
						</div>
					</form>
				)}
				{editing && (
					<form onSubmit={handleSubmit} className="mt-space-md">
						<label htmlFor={`stock-${product.id}`} className="font-label-sm text-on-surface-variant">New stock quantity</label>
						<div className="mt-1 flex gap-2">
							<input
								id={`stock-${product.id}`}
								type="number"
								inputMode="numeric"
								min="0"
								max="2147483647"
								step="1"
								required
								value={value}
								onChange={(event) => setValue(event.target.value)}
								disabled={saving}
								className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
							/>
							<button type="submit" disabled={saving} className="cursor-pointer rounded-lg bg-on-surface px-3 py-2 font-label-md font-semibold text-surface-container-lowest disabled:cursor-wait disabled:opacity-50">
								{saving ? "Saving..." : "Save"}
							</button>
							<button type="button" disabled={saving} onClick={() => setEditing(false)} className="cursor-pointer rounded-lg px-2 py-2 font-label-md text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50">
								Cancel
							</button>
						</div>
						{error && <p role="alert" className="mt-2 font-body-sm text-error">{error}</p>}
					</form>
				)}
			</div>
		</article>
	);
}

export default ProductInventoryCard;

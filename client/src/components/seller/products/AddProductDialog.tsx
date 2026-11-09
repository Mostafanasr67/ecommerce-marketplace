import { useState } from "react";
import type { FormEvent } from "react";
import type { ProductCategory } from "../../../pages/seller/SellerHelper";
import type { SellerProductCreate } from "../../../pages/seller/SellerHelper";

interface AddProductDialogProps {
	categories: ProductCategory[];
	categoriesLoading: boolean;
	categoriesError?: string;
	onClose: () => void;
	onCreate: (product: SellerProductCreate) => Promise<void>;
}

function AddProductDialog({
	categories,
	categoriesLoading,
	categoriesError,
	onClose,
	onCreate,
}: AddProductDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [stock, setStock] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [discountType, setDiscountType] = useState<"NONE" | "PERCENT" | "FIXED">("NONE");
	const [discountValue, setDiscountValue] = useState("");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const numericPrice = Number(price);
		const numericStock = Number(stock);
		const numericDiscount = Number(discountValue);
		const validMoney = (value: string) =>
			/^\d+(\.\d{1,2})?$/.test(value) && Number(value) > 0 && Number(value) <= 1000000000;

		if (!name.trim() || !validMoney(price) || !/^\d+$/.test(stock) ||
			!Number.isSafeInteger(numericStock) || numericStock > 2147483647 ||
			!categories.some((category) => category.id === categoryId) ||
			(discountType !== "NONE" &&
				(!validMoney(discountValue) ||
					numericDiscount >= (discountType === "PERCENT" ? 100 : numericPrice)))) {
			setError("Enter a product name, valid price and stock, select an existing category, and check the discount.");
			return;
		}

		setSaving(true);
		setError(null);
		try {
			await onCreate({
				name: name.trim(),
				description: description.trim() || null,
				price: numericPrice,
				stock: numericStock,
				categoryId,
				discountType: discountType === "NONE" ? null : discountType,
				discountValue: discountType === "NONE" ? null : numericDiscount,
			});
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to add product.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-space-md"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget && !saving) onClose();
			}}
			onKeyDown={(event) => {
				if (event.key === "Escape" && !saving) onClose();
			}}
		>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="add-product-title"
				className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-surface-container bg-surface-container-lowest p-space-lg shadow-xl"
			>
				<header className="flex items-start justify-between gap-space-md border-b border-surface-container pb-space-md">
					<div>
						<h2 id="add-product-title" className="font-title-lg text-title-lg font-semibold text-on-surface">Add product</h2>
						<p className="mt-1 font-body-sm text-on-surface-variant">Enter the product details. Images can be added separately.</p>
					</div>
					<button type="button" aria-label="Close dialog" disabled={saving} onClick={onClose} className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50">
						<span className="material-symbols-outlined" aria-hidden="true">close</span>
					</button>
				</header>

				<form onSubmit={handleSubmit} className="mt-space-md grid gap-space-md sm:grid-cols-2">
					<label className="flex flex-col gap-1 font-label-sm sm:col-span-2">Product name
						<input required maxLength={200} value={name} onChange={(event) => setName(event.target.value)} disabled={saving} className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 font-body-md" />
					</label>
					<label className="flex flex-col gap-1 font-label-sm sm:col-span-2">Description
						<textarea value={description} onChange={(event) => setDescription(event.target.value)} disabled={saving} rows={3} className="resize-y rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 font-body-md" />
					</label>
					<label className="flex flex-col gap-1 font-label-sm">Regular price (EGP)
						<input required type="number" min="0.01" max="1000000000" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} disabled={saving} className="rounded-lg border border-outline-variant px-3 py-2 font-body-md" />
					</label>
					<label className="flex flex-col gap-1 font-label-sm">Stock quantity
						<input required type="number" min="0" max="2147483647" step="1" value={stock} onChange={(event) => setStock(event.target.value)} disabled={saving} className="rounded-lg border border-outline-variant px-3 py-2 font-body-md" />
					</label>
					<label className="flex flex-col gap-1 font-label-sm">Category
						<select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} disabled={saving || categoriesLoading || categories.length === 0} className="rounded-lg border border-outline-variant px-3 py-2 font-body-md">
							<option value="">{categoriesLoading ? "Loading categories..." : "Select a category"}</option>
							{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
						</select>
						{!categoriesLoading && !categoriesError && categories.length === 0 && <span className="text-on-surface-variant">No categories are available yet.</span>}
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
					{discountType !== "NONE" && (
						<label className="flex flex-col gap-1 font-label-sm">Discount {discountType === "PERCENT" ? "(%)" : "(EGP)"}
							<input required type="number" min="0.01" step="0.01" value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} disabled={saving} className="rounded-lg border border-outline-variant px-3 py-2 font-body-md" />
						</label>
					)}
					{categoriesError && <p role="alert" className="font-body-sm text-error sm:col-span-2">{categoriesError}</p>}
					{error && <p role="alert" className="font-body-sm text-error sm:col-span-2">{error}</p>}
					<div className="flex justify-end gap-2 border-t border-surface-container pt-space-md sm:col-span-2">
						<button type="button" disabled={saving} onClick={onClose} className="rounded-lg px-4 py-2 font-label-md text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50">Cancel</button>
						<button type="submit" disabled={saving || categoriesLoading || categories.length === 0 || Boolean(categoriesError)} className="rounded-lg bg-on-surface px-4 py-2 font-label-md font-semibold text-surface-container-lowest disabled:cursor-wait disabled:opacity-50">{saving ? "Adding..." : "Add product"}</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export default AddProductDialog;

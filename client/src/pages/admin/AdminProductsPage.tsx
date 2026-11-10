import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { AdminProduct } from "../../types/admin";
import { AdminButton, AdminError, AdminFilters, AdminInput, AdminLoading, AdminModal, AdminPageHeader, AdminPagination, AdminSelect, AdminStatus, AdminTable, AdminTableHeader } from "../../components/admin/AdminUI";
import { fetchAdminFilterOptions, fetchAdminProducts } from "./AdminHelper";

function AdminProductsPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialSeller = searchParams.get("sellerId") ?? "";
	const [search, setSearch] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [sellerId, setSellerId] = useState(initialSeller);
	const [availability, setAvailability] = useState("");
	const [page, setPage] = useState(1);
	const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
	const optionsQuery = useQuery({ queryKey: ["admin", "filter-options"], queryFn: fetchAdminFilterOptions });
	const query = useQuery({
		queryKey: ["admin", "products", page, search, categoryId, sellerId, availability],
		queryFn: () => fetchAdminProducts({ page, search, categoryId, sellerId, availability }),
	});
	const products = query.data?.items ?? [];

	function changeSeller(value: string) {
		setSellerId(value);
		setPage(1);
		setSearchParams(value ? { sellerId: value } : {});
	}

	return (
		<>
			<AdminPageHeader title="Products" description="Browse products from every marketplace seller." />
			<AdminFilters>
				<AdminInput aria-label="Search products" placeholder="Search product, seller, or ID" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="w-full sm:w-72" />
				<AdminSelect aria-label="Filter by category" value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setPage(1); }}>
					<option value="">All categories</option>
					{optionsQuery.data?.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
				</AdminSelect>
				<AdminSelect aria-label="Filter by seller" value={sellerId} onChange={(event) => changeSeller(event.target.value)}>
					<option value="">All sellers</option>
					{optionsQuery.data?.sellers.map((seller) => <option key={seller.id} value={seller.id}>{seller.storeName}</option>)}
				</AdminSelect>
				<AdminSelect aria-label="Filter by availability" value={availability} onChange={(event) => { setAvailability(event.target.value); setPage(1); }}>
					<option value="">All availability</option>
					<option value="IN_STOCK">In stock</option>
					<option value="OUT_OF_STOCK">Out of stock</option>
				</AdminSelect>
			</AdminFilters>
			{optionsQuery.isError && <AdminError message={`Failed to load filter options: ${optionsQuery.error.message}`} />}
			{query.isPending && <AdminLoading />}
			{query.isError && <AdminError message={`Failed to load products: ${query.error.message}`} />}
			{query.data && (
				<>
					<AdminTable empty={products.length === 0}>
						<AdminTableHeader columns={["Product", "Seller", "Category", "Price", "Stock", "Status", "Actions"]} />
						<tbody className="font-body-sm">
							{products.map((product) => (
								<tr key={product.id} className="border-t border-surface-container hover:bg-surface-container-low/50">
									<td className="min-w-60 px-space-md py-3"><div className="flex items-center gap-space-sm">{product.productImages[0]?.url ? <img src={product.productImages[0].url} alt={product.productImages[0].altText || product.name} className="h-12 w-12 rounded-lg object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-low"><span className="material-symbols-outlined">inventory_2</span></div>}<div><span className="block font-label-md font-semibold">{product.name}</span><span className="font-label-sm text-on-surface-variant">{product.id}</span></div></div></td>
									<td className="px-space-md py-3">{product.seller.storeName}</td>
									<td className="px-space-md py-3">{product.category.name}</td>
									<td className="whitespace-nowrap px-space-md py-3">{Number(product.price).toLocaleString("en-EG", { maximumFractionDigits: 2 })} EGP</td>
									<td className="px-space-md py-3">{product.stock}</td>
									<td className="px-space-md py-3"><AdminStatus>{product.stock > 0 ? "In stock" : "Out of stock"}</AdminStatus></td>
									<td className="px-space-md py-3"><AdminButton type="button" onClick={() => setSelectedProduct(product)}>View details</AdminButton></td>
								</tr>
							))}
						</tbody>
					</AdminTable>
					<AdminPagination page={query.data.pagination.page} totalPages={query.data.pagination.totalPages} totalCount={query.data.pagination.totalCount} onPageChange={setPage} />
				</>
			)}
			{selectedProduct && (
				<AdminModal title={selectedProduct.name} onClose={() => setSelectedProduct(null)}>
					<div className="flex flex-col gap-space-md sm:flex-row">
						{selectedProduct.productImages[0]?.url && <img src={selectedProduct.productImages[0].url} alt={selectedProduct.productImages[0].altText || selectedProduct.name} className="h-32 w-32 rounded-xl object-cover" />}
						<dl className="grid gap-space-sm font-body-sm">
							<div><dt className="text-on-surface-variant">Seller</dt><dd>{selectedProduct.seller.storeName} · {selectedProduct.seller.user.email}</dd></div>
							<div><dt className="text-on-surface-variant">Category</dt><dd>{selectedProduct.category.name}</dd></div>
							<div><dt className="text-on-surface-variant">Price / stock</dt><dd>{Number(selectedProduct.price).toLocaleString("en-EG")} EGP · {selectedProduct.stock} units</dd></div>
							<div><dt className="text-on-surface-variant">Created</dt><dd>{new Date(selectedProduct.createdAt).toLocaleString()}</dd></div>
							<div><dt className="text-on-surface-variant">Description</dt><dd>{selectedProduct.description || "No description"}</dd></div>
						</dl>
					</div>
					<p className="mt-space-md font-label-sm text-on-surface-variant">Product editing and deletion are not enabled for administrators.</p>
				</AdminModal>
			)}
		</>
	);
}

export default AdminProductsPage;

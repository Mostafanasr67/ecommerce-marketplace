import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { AdminSeller } from "../../types/admin";
import { AdminButton, AdminError, AdminFilters, AdminInput, AdminLoading, AdminModal, AdminPageHeader, AdminPagination, AdminTable, AdminTableHeader } from "../../components/admin/AdminUI";
import { fetchAdminSellers } from "./AdminHelper";

function AdminSellersPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [selectedSeller, setSelectedSeller] = useState<AdminSeller | null>(null);
	const navigate = useNavigate();
	const query = useQuery({ queryKey: ["admin", "sellers", page, search], queryFn: () => fetchAdminSellers({ page, search }) });
	const sellers = query.data?.items ?? [];

	return (
		<>
			<AdminPageHeader title="Sellers" description="Review stores, owners, and catalog sizes." />
			<AdminFilters>
				<AdminInput aria-label="Search sellers" placeholder="Search store, owner, email, or ID" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="w-full sm:w-96" />
			</AdminFilters>
			{query.isPending && <AdminLoading />}
			{query.isError && <AdminError message={`Failed to load sellers: ${query.error.message}`} />}
			{query.data && (
				<>
					<AdminTable empty={sellers.length === 0}>
						<AdminTableHeader columns={["Store", "Owner", "Email", "Products", "Registration Date", "Actions"]} />
						<tbody className="font-body-sm">
							{sellers.map((seller) => (
								<tr key={seller.id} className="border-t border-surface-container hover:bg-surface-container-low/50">
									<td className="px-space-md py-3"><div className="flex items-center gap-space-sm"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed font-label-md font-bold text-primary">{seller.storeName[0]?.toUpperCase() ?? "S"}</div><div><span className="block font-label-md font-semibold">{seller.storeName}</span><span className="font-label-sm text-on-surface-variant">{seller.id}</span></div></div></td>
									<td className="px-space-md py-3">{seller.user.name || "Unnamed owner"}</td>
									<td className="px-space-md py-3">{seller.user.email}</td>
									<td className="px-space-md py-3">{seller._count.products}</td>
									<td className="whitespace-nowrap px-space-md py-3">{new Date(seller.createdAt).toLocaleDateString()}</td>
									<td className="px-space-md py-3"><div className="flex gap-2"><AdminButton type="button" onClick={() => setSelectedSeller(seller)}>Details</AdminButton><AdminButton type="button" onClick={() => navigate(`/admin-products?sellerId=${encodeURIComponent(seller.id)}`)}>Products</AdminButton></div></td>
								</tr>
							))}
						</tbody>
					</AdminTable>
					<AdminPagination page={query.data.pagination.page} totalPages={query.data.pagination.totalPages} totalCount={query.data.pagination.totalCount} onPageChange={setPage} />
				</>
			)}
			{selectedSeller && (
				<AdminModal title={selectedSeller.storeName} onClose={() => setSelectedSeller(null)}>
					<dl className="grid gap-space-sm font-body-sm">
						<div><dt className="text-on-surface-variant">Owner</dt><dd>{selectedSeller.user.name || "Unnamed owner"}</dd></div>
						<div><dt className="text-on-surface-variant">Email</dt><dd>{selectedSeller.user.email}</dd></div>
						<div><dt className="text-on-surface-variant">Store ID</dt><dd className="break-all">{selectedSeller.id}</dd></div>
						<div><dt className="text-on-surface-variant">Products</dt><dd>{selectedSeller._count.products}</dd></div>
						<div><dt className="text-on-surface-variant">Registered</dt><dd>{new Date(selectedSeller.createdAt).toLocaleString()}</dd></div>
					</dl>
				</AdminModal>
			)}
		</>
	);
}

export default AdminSellersPage;

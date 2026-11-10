import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AdminUser } from "../../types/admin";
import { AdminButton, AdminError, AdminFilters, AdminInput, AdminLoading, AdminModal, AdminPageHeader, AdminPagination, AdminTable, AdminTableHeader } from "../../components/admin/AdminUI";
import { fetchAdminUsers } from "./AdminHelper";

function AdminUsersPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
	const query = useQuery({ queryKey: ["admin", "users", page, search], queryFn: () => fetchAdminUsers({ page, search }) });
	const users = query.data?.items ?? [];

	return (
		<>
			<AdminPageHeader title="Users" description="Browse marketplace accounts and their roles." />
			<AdminFilters>
				<AdminInput aria-label="Search users" placeholder="Search name, email, or ID" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="w-full sm:w-80" />
			</AdminFilters>
			{query.isPending && <AdminLoading />}
			{query.isError && <AdminError message={`Failed to load users: ${query.error.message}`} />}
			{query.data && (
				<>
					<AdminTable empty={users.length === 0}>
						<AdminTableHeader columns={["User", "Email", "Registration Date", "Role", "Actions"]} />
						<tbody className="font-body-sm">
							{users.map((user) => (
								<tr key={user.id} className="border-t border-surface-container hover:bg-surface-container-low/50">
									<td className="px-space-md py-3"><span className="block font-label-md font-semibold">{user.name || "Unnamed user"}</span><span className="font-label-sm text-on-surface-variant">{user.id}</span></td>
									<td className="px-space-md py-3">{user.email}</td>
									<td className="whitespace-nowrap px-space-md py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
									<td className="px-space-md py-3">{user.role}</td>
									<td className="px-space-md py-3"><AdminButton type="button" onClick={() => setSelectedUser(user)}>View details</AdminButton></td>
								</tr>
							))}
						</tbody>
					</AdminTable>
					<AdminPagination page={query.data.pagination.page} totalPages={query.data.pagination.totalPages} totalCount={query.data.pagination.totalCount} onPageChange={setPage} />
				</>
			)}
			{selectedUser && (
				<AdminModal title="User details" onClose={() => setSelectedUser(null)}>
					<dl className="grid gap-space-sm font-body-sm">
						<div><dt className="text-on-surface-variant">Name</dt><dd>{selectedUser.name || "Unnamed user"}</dd></div>
						<div><dt className="text-on-surface-variant">Email</dt><dd>{selectedUser.email}</dd></div>
						<div><dt className="text-on-surface-variant">User ID</dt><dd className="break-all">{selectedUser.id}</dd></div>
						<div><dt className="text-on-surface-variant">Role</dt><dd>{selectedUser.role}</dd></div>
						<div><dt className="text-on-surface-variant">Registered</dt><dd>{new Date(selectedUser.createdAt).toLocaleString()}</dd></div>
					</dl>
				</AdminModal>
			)}
		</>
	);
}

export default AdminUsersPage;

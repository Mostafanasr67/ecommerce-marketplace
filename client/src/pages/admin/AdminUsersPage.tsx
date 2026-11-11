import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminUser } from "../../types/admin";
import { AdminButton, AdminError, AdminFilters, AdminInput, AdminLoading, AdminModal, AdminPageHeader, AdminPagination, AdminSelect, AdminTable, AdminTableHeader } from "../../components/admin/AdminUI";
import { fetchAdminUsers, updateAdminUserRole } from "./AdminHelper";
import { getCurrentUserId } from "../../utils/currentUser";

function AdminUsersPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
	const [selectedRole, setSelectedRole] = useState<AdminUser["role"]>("USER");
	const [storeName, setStoreName] = useState("");
	const queryClient = useQueryClient();
	const query = useQuery({ queryKey: ["admin", "users", page, search], queryFn: () => fetchAdminUsers({ page, search }) });
	const users = query.data?.items ?? [];
	const roleMutation = useMutation({
		mutationFn: () => {
			if (!selectedUser) throw new Error("Select a user before changing their role.");
			return updateAdminUserRole(selectedUser.id, selectedRole, storeName.trim());
		},
		onSuccess: async (updatedUser) => {
			setSelectedUser(updatedUser);
			setStoreName(updatedUser.seller?.storeName ?? "");
			await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
		},
	});

	function openUserDetails(user: AdminUser) {
		setSelectedUser(user);
		setSelectedRole(user.role);
		setStoreName(user.seller?.storeName ?? "");
		roleMutation.reset();
	}

	function saveRole() {
		if (!selectedUser || selectedRole === selectedUser.role) return;
		if (selectedUser.id === getCurrentUserId()) return;
		if (selectedRole === "SELLER" && !selectedUser.seller && !storeName.trim()) return;
		roleMutation.mutate();
	}

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
									<td className="px-space-md py-3"><span className="block font-label-md font-semibold">{user.name || "Unnamed user"}</span></td>
									<td className="px-space-md py-3">{user.email}</td>
									<td className="whitespace-nowrap px-space-md py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
									<td className="px-space-md py-3">{user.role}</td>
									<td className="px-space-md py-3"><AdminButton type="button" onClick={() => openUserDetails(user)}>View details</AdminButton></td>
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
						<div><dt className="text-on-surface-variant">Registered</dt><dd>{new Date(selectedUser.createdAt).toLocaleString()}</dd></div>
					</dl>
					<div className="mt-space-lg flex flex-col gap-space-sm">
						<label htmlFor="admin-user-role" className="font-label-md font-semibold text-on-surface">Role</label>
						<AdminSelect
							id="admin-user-role"
							value={selectedRole}
							disabled={roleMutation.isPending || selectedUser.id === getCurrentUserId()}
							onChange={(event) => {
								setSelectedRole(event.target.value as AdminUser["role"]);
								roleMutation.reset();
							}}
						>
							<option value="USER">User</option>
							<option value="SELLER">Seller</option>
							<option value="ADMIN">Admin</option>
						</AdminSelect>
						{selectedRole === "SELLER" && !selectedUser.seller && (
							<label className="flex flex-col gap-space-xs font-label-sm text-on-surface">
								Store name
								<AdminInput
									value={storeName}
									maxLength={120}
									onChange={(event) => setStoreName(event.target.value)}
									placeholder="Enter the seller's store name"
									disabled={roleMutation.isPending}
								/>
							</label>
						)}
						{selectedUser.id === getCurrentUserId() && <p className="text-body-sm text-on-surface-variant">You cannot change your own role.</p>}
						{roleMutation.isError && <AdminError message={`Failed to change role: ${roleMutation.error.message}`} />}
						<div className="flex justify-end">
							<AdminButton
								type="button"
								variant="primary"
								onClick={saveRole}
								disabled={roleMutation.isPending || selectedRole === selectedUser.role || selectedUser.id === getCurrentUserId() || (selectedRole === "SELLER" && !selectedUser.seller && !storeName.trim())}
							>
								{roleMutation.isPending ? "Saving..." : "Save role"}
							</AdminButton>
						</div>
					</div>
				</AdminModal>
			)}
		</>
	);
}

export default AdminUsersPage;

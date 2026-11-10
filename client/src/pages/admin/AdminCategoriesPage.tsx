import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminCategory } from "../../types/admin";
import { AdminButton, AdminError, AdminFilters, AdminInput, AdminLoading, AdminModal, AdminPageHeader, AdminStatus, AdminTable, AdminTableHeader } from "../../components/admin/AdminUI";
import { createCategory, deleteCategory, fetchAdminCategories, updateCategory } from "./AdminHelper";

function AdminCategoriesPage() {
	const [search, setSearch] = useState("");
	const [editorOpen, setEditorOpen] = useState(false);
	const [editing, setEditing] = useState<AdminCategory | null>(null);
	const [deleting, setDeleting] = useState<AdminCategory | null>(null);
	const [name, setName] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const query = useQuery({ queryKey: ["admin", "categories"], queryFn: fetchAdminCategories });
	const saveMutation = useMutation({
		mutationFn: () => editing ? updateCategory(editing.id, name.trim()) : createCategory(name.trim()),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
			await queryClient.invalidateQueries({ queryKey: ["admin", "filter-options"] });
			setEditorOpen(false);
			setEditing(null);
			setName("");
			setFormError(null);
		},
		onError: (error: Error) => setFormError(error.message),
	});
	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteCategory(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
			await queryClient.invalidateQueries({ queryKey: ["admin", "filter-options"] });
			setDeleting(null);
		},
	});
	const categories = (query.data ?? []).filter((category) => category.name.toLowerCase().includes(search.toLowerCase()));

	function openCreate() {
		setEditorOpen(true);
		setEditing(null);
		setName("");
		setFormError(null);
	}

	function openEdit(category: AdminCategory) {
		setEditorOpen(true);
		setEditing(category);
		setName(category.name);
		setFormError(null);
	}

	return (
		<>
			<AdminPageHeader title="Categories" description="Manage the categories used across the marketplace.">
				<AdminButton type="button" variant="primary" onClick={openCreate}>Add category</AdminButton>
			</AdminPageHeader>
			<AdminFilters><AdminInput aria-label="Search categories" placeholder="Search category name" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full sm:w-80" /></AdminFilters>
			{query.isPending && <AdminLoading />}
			{query.isError && <AdminError message={`Failed to load categories: ${query.error.message}`} />}
			{deleteMutation.isError && <AdminError message={`Failed to delete category: ${deleteMutation.error.message}`} />}
			{query.data && (
				<AdminTable empty={categories.length === 0}>
					<AdminTableHeader columns={["Category Name", "Products", "Created Date", "Actions"]} />
					<tbody className="font-body-sm">
						{categories.map((category) => (
							<tr key={category.id} className="border-t border-surface-container hover:bg-surface-container-low/50">
								<td className="px-space-md py-3 font-label-md font-semibold">{category.name}</td>
								<td className="px-space-md py-3"><AdminStatus>{category._count.products} products</AdminStatus></td>
								<td className="whitespace-nowrap px-space-md py-3">{new Date(category.createdAt).toLocaleDateString()}</td>
								<td className="px-space-md py-3"><div className="flex gap-2"><AdminButton type="button" onClick={() => openEdit(category)}>Edit</AdminButton><AdminButton type="button" variant="danger" onClick={() => setDeleting(category)}>Delete</AdminButton></div></td>
							</tr>
						))}
					</tbody>
				</AdminTable>
			)}
			{editorOpen && (
				<AdminModal title={editing ? "Edit category" : "Add category"} onClose={() => { setEditorOpen(false); setEditing(null); setName(""); setFormError(null); }}>
					<form onSubmit={(event) => { event.preventDefault(); if (!name.trim()) { setFormError("Category name is required."); return; } saveMutation.mutate(); }} className="flex flex-col gap-space-md">
						<label className="flex flex-col gap-1 font-label-sm">Category name
							<AdminInput autoFocus required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} disabled={saveMutation.isPending} />
						</label>
						{formError && <AdminError message={formError} />}
						<div className="flex justify-end gap-2"><AdminButton type="button" onClick={() => { setEditorOpen(false); setEditing(null); setName(""); setFormError(null); }}>Cancel</AdminButton><AdminButton type="submit" variant="primary" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Saving..." : "Save category"}</AdminButton></div>
					</form>
				</AdminModal>
			)}
			{deleting && (
				<AdminModal title="Delete category?" onClose={() => setDeleting(null)}>
					<p className="font-body-sm text-on-surface-variant">Delete “{deleting.name}”? Categories with products may not be deletable.</p>
					{deleteMutation.isError && <AdminError message={deleteMutation.error.message} />}
					<div className="mt-space-md flex justify-end gap-2"><AdminButton type="button" onClick={() => setDeleting(null)}>Cancel</AdminButton><AdminButton type="button" variant="danger" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleting.id)}>{deleteMutation.isPending ? "Deleting..." : "Delete category"}</AdminButton></div>
				</AdminModal>
			)}
		</>
	);
}

export default AdminCategoriesPage;

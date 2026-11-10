import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

function AdminPageHeader({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
	return (
		<header className="mb-space-lg flex flex-wrap items-end justify-between gap-space-md border-b border-surface-container-low pb-space-lg">
			<div>
				<h1 className="font-headline-lg text-headline-lg text-on-surface">{title}</h1>
				<p className="mt-space-xs font-body-md text-on-surface-variant">{description}</p>
			</div>
			{children}
		</header>
	);
}

function AdminFilters({ children }: { children: ReactNode }) {
	return <div className="mb-space-md flex flex-wrap items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">{children}</div>;
}

function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
	return <input {...props} className={`min-h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm font-body-sm text-on-surface placeholder:text-outline focus-visible:outline-2 focus-visible:outline-primary ${props.className ?? ""}`} />;
}

function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
	return <select {...props} className={`min-h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm font-body-sm text-on-surface focus-visible:outline-2 focus-visible:outline-primary ${props.className ?? ""}`} />;
}

function AdminButton({ children, className = "", variant = "default", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "primary" | "danger" }) {
	const variantClass = variant === "danger"
		? "border-error bg-error-container text-on-error-container hover:bg-error"
		: variant === "primary"
			? "border-primary bg-primary text-on-primary hover:bg-primary/90"
			: "border-outline-variant text-on-surface hover:bg-surface-container-low";
	return <button {...props} className={`min-h-10 cursor-pointer rounded-lg border px-space-md font-label-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${className}`}>{children}</button>;
}

function AdminTable({ children, empty }: { children: ReactNode; empty?: boolean }) {
	return (
		<div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
			<table className="w-full border-collapse text-left">
				{children}
			</table>
			{empty && <p className="p-space-lg text-center font-body-md text-on-surface-variant">No records found.</p>}
		</div>
	);
}

function AdminTableHeader({ columns }: { columns: string[] }) {
	return <thead><tr className="bg-surface-container-low font-label-sm uppercase tracking-wider text-on-surface-variant">{columns.map((column) => <th key={column} className="whitespace-nowrap px-space-md py-3">{column}</th>)}</tr></thead>;
}

function AdminPagination({ page, totalPages, totalCount, onPageChange }: { page: number; totalPages: number; totalCount: number; onPageChange: (page: number) => void }) {
	return (
		<div className="mt-space-md flex items-center justify-between rounded-xl bg-surface-container-lowest px-space-md py-3 shadow-sm">
			<p className="font-label-sm text-on-surface-variant">Page {page} of {Math.max(totalPages, 1)} · {totalCount} records</p>
			<div className="flex gap-2">
				<AdminButton type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</AdminButton>
				<AdminButton type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</AdminButton>
			</div>
		</div>
	);
}

function AdminModal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/40 p-space-md backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
			<section role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-outline-variant bg-surface-container-lowest p-space-lg shadow-xl ${wide ? "max-w-3xl" : "max-w-xl"}`}>
				<header className="mb-space-md flex items-center justify-between gap-space-md border-b border-surface-container pb-space-md">
					<h2 id="admin-modal-title" className="font-title-lg text-title-lg font-semibold text-on-surface">{title}</h2>
					<AdminButton type="button" aria-label="Close" onClick={onClose}>Close</AdminButton>
				</header>
				{children}
			</section>
		</div>
	);
}

function AdminStatus({ children }: { children: ReactNode }) {
	return <span className="inline-flex whitespace-nowrap rounded-full bg-secondary-container px-2.5 py-0.5 font-label-sm font-semibold text-on-secondary-fixed">{children}</span>;
}

function AdminError({ message }: { message: string }) {
	return <p role="alert" className="rounded-xl bg-error-container p-space-md text-body-sm text-on-error-container">{message}</p>;
}

function AdminLoading() {
	return <p className="rounded-xl bg-surface-container-lowest p-space-lg text-on-surface-variant">Loading...</p>;
}

export { AdminPageHeader, AdminFilters, AdminInput, AdminSelect, AdminButton, AdminTable, AdminTableHeader, AdminPagination, AdminModal, AdminStatus, AdminError, AdminLoading };

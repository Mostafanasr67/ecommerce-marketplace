import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SellerSidebar from "../seller/dashboard/SellerSidebar";
import SellerTopBar from "../seller/dashboard/SellerTopBar";
import { fetchAdminIdentity } from "../../pages/admin/AdminHelper";

function AdminLayout({ onLogout }: { onLogout: () => void }) {
	const identityQuery = useQuery({ queryKey: ["admin", "identity"], queryFn: fetchAdminIdentity });
	return (
		<div className="min-h-screen bg-background font-body-md text-on-surface antialiased">
			<SellerSidebar role="admin" onLogout={onLogout} />
			<div className="min-h-screen pl-72">
				{identityQuery.data && <SellerTopBar admin={identityQuery.data} />}
				<main className="min-h-screen bg-surface px-margin pb-space-xl pt-24">
					{identityQuery.isError && <p role="alert" className="mb-space-md text-error">Failed to load administrator profile: {identityQuery.error.message}</p>}
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export default AdminLayout;

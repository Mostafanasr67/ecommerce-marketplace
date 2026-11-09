import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SellerSidebar from "../../components/seller/dashboard/SellerSidebar";
import SellerTopBar from "../../components/seller/dashboard/SellerTopBar";
import { getCurrentUserId } from "../../utils/currentUser";
import { fetchSeller, updateSellerStoreName } from "./SellerHelper";

function SellerStoreSettingsPage({ onLogout }: { onLogout: () => void }) {
	const userId = getCurrentUserId();
	const queryClient = useQueryClient();
	const sellerQuery = useQuery({
		queryKey: ["seller", userId],
		queryFn: () => {
			if (!userId) throw new Error("Your session has no user ID. Please log in again.");
			return fetchSeller(userId);
		},
		enabled: Boolean(userId),
	});
	const [storeName, setStoreName] = useState<string | null>(null);
	const [validationError, setValidationError] = useState<string | null>(null);
	const updateMutation = useMutation({
		mutationFn: ({ value, expectedUpdatedAt }: { value: string; expectedUpdatedAt: string }) => {
			if (!sellerQuery.data) throw new Error("Seller profile is not available.");
			return updateSellerStoreName(sellerQuery.data.id, value, expectedUpdatedAt);
		},
		onSuccess: (seller) => {
			queryClient.setQueryData(["seller", userId], seller);
			setStoreName(null);
		},
	});

	const seller = sellerQuery.data;
	const editingName = storeName !== null;

	function saveStoreName(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!seller || storeName === null) return;
		const value = storeName.trim();
		if (!value) {
			setValidationError("Store name cannot be empty.");
			return;
		}
		setValidationError(null);
		updateMutation.mutate({ value, expectedUpdatedAt: seller.updatedAt });
	}

	return (
		<div className="min-h-screen bg-background font-body-md text-on-surface antialiased">
			<SellerSidebar onLogout={onLogout} />
			<div className="min-h-screen pl-72">
				{seller && <SellerTopBar seller={seller} />}
				<main className="min-h-screen bg-surface pt-20">
					<div className="px-margin py-space-xl">
						<header className="border-b border-surface-container-low pb-space-lg">
							<h1 className="font-headline-lg text-headline-lg text-on-surface">Store settings</h1>
							<p className="mt-space-xs font-body-md text-on-surface-variant">Manage the name displayed for your store.</p>
						</header>
						<section aria-label="Store details" className="mt-space-lg max-w-3xl rounded-xl border border-surface-container bg-surface-container-lowest p-space-lg shadow-sm">
							<div className="flex items-start gap-space-md">
								<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant">
									<span className="material-symbols-outlined" aria-hidden="true">storefront</span>
								</div>
								<div className="min-w-0 flex-1">
									<h2 className="font-title-md text-title-md font-semibold text-on-surface">Store name</h2>
									<p className="mt-1 font-body-sm text-on-surface-variant">This name appears in your seller profile and marketplace listings.</p>
									{!userId && <p role="alert" className="mt-space-md text-error">Your session has no user ID. Please log in again.</p>}
									{userId && sellerQuery.isPending && <p className="mt-space-md text-on-surface-variant">Loading store settings...</p>}
									{sellerQuery.isError && <p role="alert" className="mt-space-md text-error">Failed to load store settings: {sellerQuery.error.message}</p>}
									{seller && !editingName && (
										<div className="mt-space-lg flex flex-wrap items-center justify-between gap-space-md">
											<p className="break-words font-label-lg font-semibold text-on-surface">{seller.storeName}</p>
											<button type="button" onClick={() => { setStoreName(seller.storeName); setValidationError(null); updateMutation.reset(); }} className="cursor-pointer rounded-lg border border-outline-variant px-4 py-2 font-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-primary">
												Edit name
											</button>
										</div>
									)}
									{seller && editingName && (
										<form onSubmit={saveStoreName} className="mt-space-lg">
											<label htmlFor="seller-store-name" className="font-label-sm text-on-surface-variant">Store name</label>
											<input
												id="seller-store-name"
												type="text"
												required
												maxLength={100}
												autoComplete="organization"
												value={storeName}
												onChange={(event) => { setStoreName(event.target.value); setValidationError(null); }}
												disabled={updateMutation.isPending}
												className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
											/>
											{validationError && <p role="alert" className="mt-space-sm font-body-sm text-error">{validationError}</p>}
											{updateMutation.isError && <p role="alert" className="mt-space-sm font-body-sm text-error">{updateMutation.error.message}</p>}
											<div className="mt-space-md flex gap-space-sm">
												<button type="submit" disabled={updateMutation.isPending} className="cursor-pointer rounded-lg bg-on-surface px-4 py-2 font-label-md font-semibold text-surface-container-lowest disabled:opacity-50">
													{updateMutation.isPending ? "Saving..." : "Save changes"}
												</button>
												<button type="button" disabled={updateMutation.isPending} onClick={() => { setStoreName(null); setValidationError(null); updateMutation.reset(); }} className="cursor-pointer rounded-lg px-4 py-2 font-label-md text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50">
													Cancel
												</button>
											</div>
										</form>
									)}
									{updateMutation.isSuccess && <p role="status" className="mt-space-md font-body-sm text-on-surface-variant">Store name updated.</p>}
								</div>
							</div>
						</section>
					</div>
				</main>
			</div>
		</div>
	);
}

export default SellerStoreSettingsPage;

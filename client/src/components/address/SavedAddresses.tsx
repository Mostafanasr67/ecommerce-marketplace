import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddressCard from "./AddressCard";
import {
	fetchAddresses,
	deleteAddress,
	setDefaultAddress,
	type Address,
} from "./AddressHelper";

type SavedAddressesProps = {
	onEdit?: (address: Address) => void;
};

function SavedAddresses({ onEdit }: SavedAddressesProps) {
	const queryClient = useQueryClient();
	const addressQuery = useQuery({ queryKey: ["addresses"], queryFn: fetchAddresses });
	const addresses: Address[] = useMemo(() => addressQuery.data?.addresses ?? [], [addressQuery.data]);
	const defaultAddressId = addressQuery.data?.defaultAddressId ?? null;

	const deleteAddressMutation = useMutation({
		mutationFn: (id: string) => {
			return deleteAddress(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
		},
	});

	const setDefaultAddressMutation = useMutation({
		mutationFn: (id: string) => {
			return setDefaultAddress(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
		},
	});

	return (
		<section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-space-sm">
					<span className="h-6 w-2.5 rounded-full bg-primary" />
					<h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
						Saved Delivery Addresses
					</h2>
				</div>
			</div>

			<div className="flex flex-col gap-space-md">
				{addresses.map((address) => (
					<AddressCard
						key={address.id}
						address={address}
						isDefault={address.id === defaultAddressId}
						onEdit={() => onEdit?.(address)}
						onDelete={() => deleteAddressMutation.mutate(address.id)}
						onSetDefault={() => setDefaultAddressMutation.mutate(address.id)}
					/>
				))}
			</div>
		</section>
	);
}

export default SavedAddresses;

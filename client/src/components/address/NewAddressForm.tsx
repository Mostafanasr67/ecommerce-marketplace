// Fields: label, fullName, phone, country, city, area, street, building, apartment.
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress, updateAddress, type Address, type AddressInput } from "./AddressHelper";

const labelOptions = ["Home", "Work", "Other"];
const cityOptions = ["Giza", "Cairo", "Alexandria"];

const requiredFields: { key: keyof AddressInput; title: string }[] = [
	{ key: "fullName", title: "Full name" },
	{ key: "phone", title: "Phone" },
	{ key: "country", title: "Country" },
	{ key: "city", title: "City" },
	{ key: "area", title: "Area" },
	{ key: "street", title: "Street" },
	{ key: "building", title: "Building" },
	{ key: "apartment", title: "Apartment" },
];

const inputClass =
	"w-full rounded-lg border-none bg-surface-container-low px-space-md py-space-sm font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary";
const labelClass = "font-label-md text-label-md font-semibold text-on-surface-variant";

type NewAddressFormProps = {
	editingAddress?: Address | null;
	onFinish?: () => void;
};

function toFormValues(address?: Address | null): AddressInput {
	return {
		label: address?.label ?? labelOptions[0],
		fullName: address?.fullName ?? "",
		phone: address?.phone ?? "",
		country: address?.country ?? "Egypt",
		city: address?.city ?? "Giza",
		area: address?.area ?? "",
		street: address?.street ?? "",
		building: address?.building ?? "",
		apartment: address?.apartment ?? "",
	};
}

function NewAddressForm({ editingAddress, onFinish }: NewAddressFormProps) {
	const queryClient = useQueryClient();
	const [values, setValues] = useState<AddressInput>(() => toFormValues(editingAddress));
	const [validationError, setValidationError] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (editingAddress) {
			formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, [editingAddress]);

	function updateField(name: keyof AddressInput, value: string) {
		setValues((prev) => ({ ...prev, [name]: value }));
	}

	const createAddressMutation = useMutation({
		mutationFn: (data: AddressInput) => createAddress(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
			setValues(toFormValues());
			onFinish?.();
		},
	});

	const updateAddressMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: AddressInput }) => updateAddress(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
			onFinish?.();
		},
	});

	const activeMutation = editingAddress ? updateAddressMutation : createAddressMutation;

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const missing = requiredFields.filter(({ key }) => !values[key].trim());
		if (missing.length > 0) {
			setValidationError(`Please fill in: ${missing.map(({ title }) => title).join(", ")}`);
			return;
		}
		setValidationError(null);
		if (editingAddress) {
			updateAddressMutation.mutate({ id: editingAddress.id, data: values });
		} else {
			createAddressMutation.mutate(values);
		}
	}

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit}
			className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
		>
			<div className="flex items-center gap-space-sm">
				<span className="h-6 w-2.5 rounded-full bg-primary" />
				<h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
					{editingAddress ? "Update Existing Address" : "Add New Address"}
				</h2>
			</div>

			<div className="flex flex-col gap-space-xs">
				<span className={labelClass}>Label</span>
				<div className="flex flex-wrap gap-space-sm">
					{labelOptions.map((option) => (
						<button
							key={option}
							type="button"
							onClick={() => {
								updateField("label", option);
							}}
							className={`rounded-full px-space-md py-space-xs font-label-md text-label-md font-semibold ${
								values.label === option
									? "bg-primary text-on-primary"
									: "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
							}`}
						>
							{option}
						</button>
					))}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>Full name</span>
					<input type="text" className={inputClass} placeholder="Recipient name" value={values.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
				</label>

				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>Phone</span>
					<div className="flex items-center gap-space-sm">
						<span className="rounded-lg bg-surface-container px-space-sm py-space-sm font-body-md text-body-md text-on-surface-variant">
							+20
						</span>
						<input type="tel" className={inputClass} placeholder="100 000 0000" value={values.phone} onChange={(e) => updateField("phone", e.target.value)} />
					</div>
				</label>

				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>Country</span>
					<input type="text" className={inputClass} value={values.country} onChange={(e) => updateField("country", e.target.value)} />
				</label>

				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>City</span>
					<select className={inputClass} value={values.city} onChange={(e) => updateField("city", e.target.value)}>
						{cityOptions.map((city) => (
							<option key={city} value={city}>
								{city}
							</option>
						))}
					</select>
				</label>

				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>Area</span>
					<input type="text" className={inputClass} placeholder="e.g. Dokki" value={values.area} onChange={(e) => updateField("area", e.target.value)} />
				</label>

				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>Street</span>
					<input type="text" className={inputClass} placeholder="Street name" value={values.street} onChange={(e) => updateField("street", e.target.value)} />
				</label>

				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>Building</span>
					<input type="text" className={inputClass} placeholder="Building number" value={values.building} onChange={(e) => updateField("building", e.target.value)} />
				</label>

				<label className="flex flex-col gap-space-xs">
					<span className={labelClass}>Apartment</span>
					<input type="text" className={inputClass} placeholder="Apartment / floor" value={values.apartment} onChange={(e) => updateField("apartment", e.target.value)} />
				</label>
			</div>

			{(validationError || activeMutation.isError) && (
				<p className="font-body-sm text-body-sm text-error">
					{validationError ?? activeMutation.error?.message}
				</p>
			)}

			<div className="flex justify-end gap-space-sm">
				<button
					type="button"
					onClick={() => {
						setValues(toFormValues());
						setValidationError(null);
						onFinish?.();
					}}
					className="rounded-lg bg-surface-container-low px-space-lg py-space-sm font-label-md text-label-md font-semibold text-on-surface-variant hover:bg-surface-container"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={activeMutation.isPending}
					className="rounded-lg bg-primary px-space-lg py-space-sm font-label-md text-label-md font-semibold text-on-primary"
				>
					{editingAddress ? "Update Address" : "Save Address"}
				</button>
			</div>
		</form>
	);
}

export default NewAddressForm;

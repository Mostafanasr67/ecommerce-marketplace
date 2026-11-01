type Address = {
    id: string;
    userId: string;
    label: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    area: string;
    country: string;
    building: string;
    apartment: string;
    createdAt: string;
    updatedAt: string;
};

// Every field is required by the server when creating an address.
type AddressInput = Pick<
    Address,
    "label" | "fullName" | "phone" | "street" | "city" | "area" | "country" | "building" | "apartment"
>;

type AddressUpdate = Partial<AddressInput>;

export type { Address, AddressInput, AddressUpdate };
const API_URL = "http://localhost:5000";

// Mirrors the Address model in server/prisma/schema.prisma.
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? `Request failed with status ${res.status}`);
    }
    return res.json() as Promise<T>;
}

type AddressesResponse = {
    addresses: Address[];
    defaultAddressId: string | null;
};

async function fetchAddresses(): Promise<AddressesResponse> {
    return request<AddressesResponse>("/addresses");
}

async function fetchAddressById(id: string): Promise<Address> {
    return request<Address>(`/addresses/${id}`);
}

async function createAddress(data: AddressInput): Promise<Address> {
    return request<Address>("/addresses", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

async function updateAddress(id: string, data: AddressUpdate): Promise<Address> {
    return request<Address>(`/addresses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

async function deleteAddress(id: string): Promise<Address> {
    return request<Address>(`/addresses/${id}`, { method: "DELETE" });
}

// Marks the address as the user's default. The server stores it on User.defaultAddressId.
async function setDefaultAddress(id: string): Promise<Address> {
    return request<Address>(`/addresses/${id}/default`, { method: "PATCH" });
}


export {
    fetchAddresses,
    fetchAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
};

export type { Address, AddressInput, AddressUpdate, AddressesResponse };

const API_URL = "http://localhost:5000";

import type { Address, AddressInput, AddressUpdate } from "../../types/address";

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

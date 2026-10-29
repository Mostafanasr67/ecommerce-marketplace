import type { Request, Response } from "express";
import {
    getAllAddresses as getAllAddressesService,
    getAddressById as getAddressByIdService,
    createAddress as createAddressService,
    updateAddress as updateAddressService,
    deleteAddress as deleteAddressService
} from "../services/address.service.js";

async function getAllAddresses(req: Request, res: Response) {
    // Get the logged-in user's addresses
    const userId = req.user?.id as string;
    const addresses = await getAllAddressesService(userId);
    res.json(addresses);
}

async function getAddressById(req: Request, res: Response) {
    // Get address by ID
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const address = await getAddressByIdService(id, userId);
    res.json(address);
}

async function createAddress(req: Request, res: Response) {
    // Create a new address for the logged-in user
    const userId = req.user?.id as string;
    const address = await createAddressService(req.body, userId);
    res.status(201).json(address);
}

async function updateAddress(req: Request, res: Response) {
    // Update address by ID
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const address = await updateAddressService(id, req.body, userId);
    res.json(address);
}

async function deleteAddress(req: Request, res: Response) {
    // Delete address by ID
    const { id } = req.params as { id: string };
    const userId = req.user?.id as string;
    const address = await deleteAddressService(id, userId);
    res.json(address);
}

export {
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress
};
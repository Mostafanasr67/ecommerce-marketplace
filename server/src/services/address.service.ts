import prisma from "../prisma.js"
import AppError from "../utils/appError.js";

const ADDRESS_FIELDS = ["label", "fullName", "phone", "street", "city", "area", "country", "building", "apartment"] as const;

type AddressFields = Record<(typeof ADDRESS_FIELDS)[number], string>;

// Keeps only known address fields, so clients cannot set id, userId, or timestamps.
// Create requires every field; update accepts any subset.
function pickAddressFields(data: unknown, partial: boolean): Partial<AddressFields> {
    if (typeof data !== "object" || data === null) {
        throw new AppError("Request body must be an object", 400);
    }
    const input = data as Record<string, unknown>;
    const result: Partial<AddressFields> = {};

    for (const field of ADDRESS_FIELDS) {
        const value = input[field];
        if (value === undefined) {
            if (!partial) {
                throw new AppError(`${field} is required`, 400);
            }
            continue;
        }
        if (typeof value !== "string" || value.trim() === "") {
            throw new AppError(`${field} must be a non-empty string`, 400);
        }
        result[field] = value.trim();
    }

    if (partial && Object.keys(result).length === 0) {
        throw new AppError("No valid address fields provided", 400);
    }
    return result;
}

async function getAllAddresses(userId: string) {
    const [addresses, user] = await Promise.all([
        prisma.address.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'asc'
            }
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { defaultAddressId: true }
        })
    ]);
    return { addresses, defaultAddressId: user?.defaultAddressId ?? null };
}

async function getAddressById(id: string, userId: string) {
    const address = await prisma.address.findUnique({
        where: {
            id: id,
            userId: userId
        }
    });
    if (!address) {
        throw new AppError("Address not found", 404);
    }
    return address;
}

async function createAddress(data: unknown, userId: string) {
    const fields = pickAddressFields(data, false) as AddressFields;
    const address = await prisma.address.create({
        data: { ...fields, userId }
    });
    return address;
}

async function updateAddress(id: string, data: unknown, userId: string) {
    const fields = pickAddressFields(data, true);
    const address = await prisma.address.update({
        where: {
            id: id,
            userId: userId
        },
        data: fields
    });
    return address;
}

// User.defaultAddressId has no foreign key, so clear it manually when its address is deleted.
async function deleteAddress(id: string, userId: string) {
    const address = await prisma.$transaction(async (tx) => {
        const deleted = await tx.address.delete({
            where: {
                id: id,
                userId: userId
            }
        });
        await tx.user.updateMany({
            where: { id: userId, defaultAddressId: id },
            data: { defaultAddressId: null }
        });
        return deleted;
    });
    return address;
}

async function setDefaultAddress(id: string, userId: string) {
    const address = await prisma.address.findFirst({
        where: { id: id, userId: userId }
    });
    if (!address) {
        throw new AppError("Address not found", 404);
    }
    await prisma.user.update({
        where: { id: userId },
        data: { defaultAddressId: id }
    });
    return address;
}

export {
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};
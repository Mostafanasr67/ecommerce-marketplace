import prisma from "../prisma.js"
import AppError from "../utils/appError.js";

// Luhn checksum, which catches most mistyped card numbers.
function passesLuhn(digits: string) {
    let sum = 0;
    let double = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = Number(digits[i]);
        if (double) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        double = !double;
    }
    return sum % 10 === 0;
}

function detectBrand(digits: string) {
    if (digits.startsWith("4")) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
    if (digits.startsWith("507")) return "Meeza";
    return "Card";
}

// Validates the card and returns only what is safe to store: the brand and last 4 digits.
// The full number and CVV are checked here and then discarded.
function pickCardFields(data: unknown) {
    if (typeof data !== "object" || data === null) {
        throw new AppError("Request body must be an object", 400);
    }
    const input = data as Record<string, unknown>;

    const holderName = typeof input.holderName === "string" ? input.holderName.trim() : "";
    if (!holderName) {
        throw new AppError("holderName must be a non-empty string", 400);
    }

    const digits = typeof input.cardNumber === "string" ? input.cardNumber.replace(/[\s-]/g, "") : "";
    if (!/^\d{12,19}$/.test(digits) || !passesLuhn(digits)) {
        throw new AppError("Card number is invalid", 400);
    }

    const cvv = typeof input.cvv === "string" ? input.cvv.trim() : "";
    if (!/^\d{3,4}$/.test(cvv)) {
        throw new AppError("CVV must be 3 or 4 digits", 400);
    }

    const expiryMonth = Number(input.expiryMonth);
    const expiryYear = Number(input.expiryYear);
    if (!Number.isInteger(expiryMonth) || expiryMonth < 1 || expiryMonth > 12) {
        throw new AppError("Expiry month must be between 1 and 12", 400);
    }
    if (!Number.isInteger(expiryYear) || expiryYear < 1000) {
        throw new AppError("Expiry year must be a 4-digit year", 400);
    }
    const now = new Date();
    const currentMonthIndex = now.getFullYear() * 12 + now.getMonth();
    if (expiryYear * 12 + (expiryMonth - 1) < currentMonthIndex) {
        throw new AppError("Card has expired", 400);
    }

    return {
        holderName,
        brand: detectBrand(digits),
        last4: digits.slice(-4),
        expiryMonth,
        expiryYear,
    };
}

async function getAllCards(userId: string) {
    const [cards, user] = await Promise.all([
        prisma.card.findMany({
            where: { userId },
            orderBy: { createdAt: "asc" },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { defaultCardId: true },
        }),
    ]);
    return { cards, defaultCardId: user?.defaultCardId ?? null };
}

async function createCard(data: unknown, userId: string) {
    const fields = pickCardFields(data);
    const card = await prisma.card.create({
        data: { ...fields, userId },
    });
    return card;
}

// User.defaultCardId has no foreign key, so clear it manually when its card is deleted.
async function deleteCard(id: string, userId: string) {
    const card = await prisma.$transaction(async (tx) => {
        const deleted = await tx.card.delete({
            where: { id, userId },
        });
        await tx.user.updateMany({
            where: { id: userId, defaultCardId: id },
            data: { defaultCardId: null },
        });
        return deleted;
    });
    return card;
}

async function setDefaultCard(id: string, userId: string) {
    const card = await prisma.card.findFirst({
        where: { id, userId },
    });
    if (!card) {
        throw new AppError("Card not found", 404);
    }
    await prisma.user.update({
        where: { id: userId },
        data: { defaultCardId: id },
    });
    return card;
}

export {
    getAllCards,
    createCard,
    deleteCard,
    setDefaultCard,
};

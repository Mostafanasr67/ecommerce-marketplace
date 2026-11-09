import { Prisma } from "../../generated/prisma/client.js";

type PriceFields = {
    price: Prisma.Decimal;
    discountType: string | null;
    discountValue: Prisma.Decimal | null;
};

function effectivePrice(product: PriceFields): Prisma.Decimal {
    if (!product.discountType || !product.discountValue) return product.price;
    const discount = product.discountType === "PERCENT"
        ? product.price.mul(product.discountValue).div(100)
        : product.discountValue;
    return product.price.minus(discount).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

function customerProduct<T extends PriceFields>(product: T) {
    return { ...product, originalPrice: product.price, price: effectivePrice(product) };
}

export { effectivePrice, customerProduct };

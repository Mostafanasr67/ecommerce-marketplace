import assert from "node:assert/strict";
import { test } from "node:test";
import { Prisma } from "../generated/prisma/client.ts";
import prisma from "../src/prisma.ts";
import { createOrder, previewOrder } from "../src/services/order.service.ts";

test("marketplace coupon reduces customer total without changing seller subtotals and is redeemed once", async (t) => {
	const address = prisma.address;
	const cart = prisma.cart;
	const redemption = prisma.couponRedemption;
	const originals = { address: address.findFirst, cart: cart.findUnique, redemption: redemption.findUnique, transaction: prisma.$transaction };
	t.after(() => {
		address.findFirst = originals.address;
		cart.findUnique = originals.cart;
		redemption.findUnique = originals.redemption;
		prisma.$transaction = originals.transaction;
	});
	address.findFirst = async () => ({ fullName: "Buyer", phone: "1", street: "Street", city: "City", area: "Area", country: "Egypt", building: "1", apartment: "1" });
	cart.findUnique = async () => ({ id: "c1", cartItems: [
		{ productId: "p1", quantity: 2, product: { sellerId: "s1", name: "One", stock: 5, price: new Prisma.Decimal("100"), discountType: "PERCENT", discountValue: new Prisma.Decimal("10") } },
		{ productId: "p2", quantity: 1, product: { sellerId: "s2", name: "Two", stock: 5, price: new Prisma.Decimal("50"), discountType: null, discountValue: null } },
	] });
	const used = new Set();
	redemption.findUnique = async ({ where }) => used.has(`${where.userId_code.userId}:${where.userId_code.code}`) ? {} : null;
	let captured;
	let failStock = false;
	prisma.$transaction = async (callback) => {
		let reserved;
		const result = await callback({
			order: { create: async ({ data }) => { captured = data; return { id: "order-1" }; } },
			couponRedemption: { create: async ({ data }) => {
				const key = `${data.userId}:${data.code}`;
				if (used.has(key)) throw new Prisma.PrismaClientKnownRequestError("duplicate", { code: "P2002", clientVersion: "test" });
				reserved = key;
			} },
			product: { updateMany: async () => ({ count: failStock ? 0 : 1 }) },
			cartItem: { deleteMany: async () => ({ count: 2 }) },
		});
		if (reserved) used.add(reserved);
		return result;
	};
	const quote = await previewOrder("buyer", " welcome50 ");
	assert.equal(quote.regularSubtotal.toString(), "250");
	assert.equal(quote.subtotal.toString(), "230");
	assert.equal(quote.couponDiscount.toString(), "115");
	assert.equal(quote.total.toString(), "150");
	await assert.rejects(previewOrder("buyer", "invalid"), { statusCode: 400 });
	failStock = true;
	await assert.rejects(createOrder("buyer", { addressId: "a1", paymentMethod: "COD", couponCode: "WELCOME50" }), { statusCode: 409 });
	assert.equal(used.size, 0);
	failStock = false;
	await createOrder("buyer", { addressId: "a1", paymentMethod: "COD", couponCode: "welcome50" });
	assert.equal(captured.couponCode, "WELCOME50");
	assert.equal(captured.couponDiscount.toString(), "115");
	assert.equal(captured.totalAmount.toString(), "150");
	assert.equal(captured.payment.create.amount.toString(), "150");
	assert.deepEqual(captured.sellerOrders.create.map((seller) => seller.subTotal.toString()), ["180", "50"]);
	await assert.rejects(previewOrder("buyer", "WELCOME50"), { statusCode: 409 });
	await assert.rejects(createOrder("buyer", { addressId: "a1", paymentMethod: "COD", couponCode: "WELCOME50" }), { statusCode: 409 });
	await createOrder("another-buyer", { addressId: "a1", paymentMethod: "COD", couponCode: "WELCOME50" });
	assert.equal(used.size, 2);
});

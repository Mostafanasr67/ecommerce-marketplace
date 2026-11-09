import assert from "node:assert/strict";
import { test } from "node:test";
import { Prisma } from "../generated/prisma/client.ts";
import prisma from "../src/prisma.ts";
import { createOrder } from "../src/services/order.service.ts";

test("checkout stores discounted item prices and protects against concurrent price changes", async (t) => {
	const address = prisma.address;
	const cart = prisma.cart;
	const originalAddress = address.findFirst;
	const originalCart = cart.findUnique;
	const originalTransaction = prisma.$transaction;
	t.after(() => {
		address.findFirst = originalAddress;
		cart.findUnique = originalCart;
		prisma.$transaction = originalTransaction;
	});
	address.findFirst = async () => ({ fullName: "Buyer", phone: "1", street: "Street", city: "City", area: "Area", country: "Egypt", building: "1", apartment: "1" });
	cart.findUnique = async () => ({
		id: "cart-1",
		cartItems: [
			{ productId: "p1", quantity: 2, product: { sellerId: "s1", name: "One", stock: 5, price: new Prisma.Decimal("100"), discountType: "PERCENT", discountValue: new Prisma.Decimal("10") } },
			{ productId: "p2", quantity: 1, product: { sellerId: "s1", name: "Two", stock: 5, price: new Prisma.Decimal("50"), discountType: "FIXED", discountValue: new Prisma.Decimal("5") } },
		],
	});
	let orderData;
	let reservations = [];
	let conflict = false;
	prisma.$transaction = async (callback) => callback({
		order: { create: async ({ data }) => { orderData = data; return { id: "created" }; } },
		product: { updateMany: async ({ where }) => { reservations.push(where); return { count: conflict ? 0 : 1 }; } },
		cartItem: { deleteMany: async () => ({ count: 2 }) },
	});

	await createOrder("buyer", { addressId: "address", paymentMethod: "COD" });
	assert.equal(orderData.totalAmount.toString(), "260");
	assert.equal(orderData.sellerOrders.create[0].subTotal.toString(), "225");
	assert.deepEqual(orderData.sellerOrders.create[0].orderItems.create.map((item) => item.unitPrice.toString()), ["90", "45"]);
	assert.equal(reservations[0].discountType, "PERCENT");
	assert.equal(reservations[0].discountValue.toString(), "10");
	conflict = true;
	reservations = [];
	await assert.rejects(createOrder("buyer", { addressId: "address", paymentMethod: "COD" }), { statusCode: 409 });
});

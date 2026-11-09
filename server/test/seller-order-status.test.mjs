import assert from "node:assert/strict";
import { test } from "node:test";
import prisma from "../src/prisma.ts";
import { updateSellerOrderStatus } from "../src/services/seller.service.ts";
import { updateSellerOrderStatusById } from "../src/controllers/seller.controller.ts";

test("status endpoint rejects unauthorized sellers and invalid statuses", async (t) => {
	const seller = prisma.seller;
	const originalFindUnique = seller.findUnique;
	t.after(() => { seller.findUnique = originalFindUnique; });
	seller.findUnique = async () => ({ id: "seller-1", userId: "user-1" });
	const response = {};
	await assert.rejects(
		updateSellerOrderStatusById({ params: { sellerId: "seller-1", orderId: "order-1" }, body: { status: "SHIPPED" } }, response),
		{ statusCode: 401 },
	);
	await assert.rejects(
		updateSellerOrderStatusById({ user: { id: "user-1" }, params: { sellerId: "other-seller", orderId: "order-1" }, body: { status: "SHIPPED" } }, response),
		{ statusCode: 403 },
	);
	await assert.rejects(
		updateSellerOrderStatusById({ user: { id: "user-1" }, params: { sellerId: "seller-1", orderId: "order-1" }, body: { status: "INVALID" } }, response),
		{ statusCode: 400 },
	);
});

test("seller order status updates reserve and restore stock atomically", async (t) => {
	let state = {
		order: {
			id: "order-1",
			sellerId: "seller-1",
			status: "PENDING",
			orderItems: [
				{ productId: "product-1", quantity: 2, product: { name: "Product" } },
			],
		},
		stock: 3,
	};
	let conflict = false;
	const originalTransaction = prisma.$transaction;
	t.after(() => { prisma.$transaction = originalTransaction; });
	prisma.$transaction = async (callback) => {
		const draft = structuredClone(state);
		const tx = {
			sellerOrder: {
				findFirst: async ({ where }) =>
					where.id === draft.order.id && where.sellerId === draft.order.sellerId
						? structuredClone(draft.order)
						: null,
				updateMany: async ({ where, data }) => {
					if (conflict || where.status !== draft.order.status) return { count: 0 };
					draft.order.status = data.status;
					return { count: 1 };
				},
			},
			product: {
				update: async ({ data }) => { draft.stock += data.stock.increment; },
				updateMany: async ({ where, data }) => {
					if (draft.stock < where.stock.gte) return { count: 0 };
					draft.stock -= data.stock.decrement;
					return { count: 1 };
				},
			},
		};
		const result = await callback(tx);
		state = draft;
		return result;
	};

	await assert.rejects(updateSellerOrderStatus("other-seller", "order-1", "CANCELLED"), { statusCode: 404 });
	assert.equal(state.stock, 3);
	await updateSellerOrderStatus("seller-1", "order-1", "CONFIRMED");
	assert.equal(state.stock, 3);
	await updateSellerOrderStatus("seller-1", "order-1", "CANCELLED");
	assert.equal(state.stock, 5);
	await updateSellerOrderStatus("seller-1", "order-1", "CANCELLED");
	assert.equal(state.stock, 5);
	await updateSellerOrderStatus("seller-1", "order-1", "PROCESSING");
	assert.equal(state.stock, 3);
	await updateSellerOrderStatus("seller-1", "order-1", "CANCELLED");
	state.stock = 1;
	await assert.rejects(updateSellerOrderStatus("seller-1", "order-1", "PENDING"), { statusCode: 409 });
	assert.equal(state.order.status, "CANCELLED");
	assert.equal(state.stock, 1);
	conflict = true;
	await assert.rejects(updateSellerOrderStatus("seller-1", "order-1", "SHIPPED"), { statusCode: 409 });
	assert.equal(state.order.status, "CANCELLED");
	assert.equal(state.stock, 1);
});

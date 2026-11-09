import assert from "node:assert/strict";
import { test } from "node:test";
import prisma from "../src/prisma.ts";
import { updateSellerProductStock } from "../src/services/seller.service.ts";
import { updateSellerProductStockById } from "../src/controllers/seller.controller.ts";

test("stock endpoint requires the owning seller and valid quantities", async (t) => {
	const seller = prisma.seller;
	const originalFindUnique = seller.findUnique;
	t.after(() => { seller.findUnique = originalFindUnique; });
	seller.findUnique = async () => ({ id: "seller-1", userId: "user-1" });
	const params = { sellerId: "seller-1", productId: "product-1" };
	const response = {};
	await assert.rejects(updateSellerProductStockById({ params, body: { stock: 3, expectedStock: 2 } }, response), { statusCode: 401 });
	await assert.rejects(updateSellerProductStockById({ user: { id: "user-1" }, params: { ...params, sellerId: "other" }, body: { stock: 3, expectedStock: 2 } }, response), { statusCode: 403 });
	for (const stock of [-1, 1.5, 2147483648, "3", null]) {
		await assert.rejects(updateSellerProductStockById({ user: { id: "user-1" }, params, body: { stock, expectedStock: 2 } }, response), { statusCode: 400 });
	}
	await assert.rejects(updateSellerProductStockById({ user: { id: "user-1" }, params, body: { stock: 3 } }, response), { statusCode: 400 });
});

test("stock update checks ownership and detects stale stock", async (t) => {
	const product = prisma.product;
	const originalUpdateMany = product.updateMany;
	const originalFindFirst = product.findFirst;
	t.after(() => {
		product.updateMany = originalUpdateMany;
		product.findFirst = originalFindFirst;
	});
	let stock = 5;
	product.updateMany = async ({ where, data }) => {
		if (where.id !== "product-1" || where.sellerId !== "seller-1" || where.stock !== stock) return { count: 0 };
		stock = data.stock;
		return { count: 1 };
	};
	product.findFirst = async ({ where }) =>
		where.id === "product-1" && where.sellerId === "seller-1" ? { id: "product-1" } : null;

	assert.deepEqual(await updateSellerProductStock("seller-1", "product-1", 5, 10), { id: "product-1", stock: 10 });
	assert.deepEqual(await updateSellerProductStock("seller-1", "product-1", 10, 0), { id: "product-1", stock: 0 });
	await assert.rejects(updateSellerProductStock("seller-1", "product-1", 10, 2), { statusCode: 409 });
	await assert.rejects(updateSellerProductStock("other", "product-1", 0, 2), { statusCode: 404 });
	assert.equal(stock, 0);
});

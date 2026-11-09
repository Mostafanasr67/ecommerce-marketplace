import assert from "node:assert/strict";
import { test } from "node:test";
import { Prisma } from "../generated/prisma/client.ts";
import prisma from "../src/prisma.ts";
import { effectivePrice, customerProduct } from "../src/utils/productPricing.ts";
import { updateSellerProductDetails } from "../src/services/seller.service.ts";
import { updateSellerProductDetailsById } from "../src/controllers/seller.controller.ts";

test("product discounts calculate and round the checkout price", () => {
	const price = new Prisma.Decimal("100.01");
	assert.equal(effectivePrice({ price, discountType: null, discountValue: null }).toString(), "100.01");
	assert.equal(effectivePrice({ price, discountType: "PERCENT", discountValue: new Prisma.Decimal("10") }).toString(), "90.01");
	assert.equal(effectivePrice({ price, discountType: "FIXED", discountValue: new Prisma.Decimal("7.50") }).toString(), "92.51");
	const product = customerProduct({ price, discountType: "PERCENT", discountValue: new Prisma.Decimal("10") });
	assert.equal(product.originalPrice.toString(), "100.01");
	assert.equal(product.price.toString(), "90.01");
});

test("product editor validates seller, price, discounts and version", async (t) => {
	const seller = prisma.seller;
	const find = seller.findUnique;
	t.after(() => { seller.findUnique = find; });
	seller.findUnique = async () => ({ id: "seller-1", userId: "user-1" });
	const base = { user: { id: "user-1" }, params: { sellerId: "seller-1", productId: "p1" }, body: { name: "Product", price: 20, discountType: "PERCENT", discountValue: 10, expectedUpdatedAt: "2026-01-01T00:00:00.000Z" } };
	await assert.rejects(updateSellerProductDetailsById({ ...base, user: undefined }, {}), { statusCode: 401 });
	await assert.rejects(updateSellerProductDetailsById({ ...base, params: { ...base.params, sellerId: "other" } }, {}), { statusCode: 403 });
	for (const values of [
		{ name: " " }, { price: 0 }, { price: 1.001 }, { discountValue: 100 },
		{ discountType: "FIXED", discountValue: 20 }, { discountType: null, discountValue: 1 },
		{ discountType: "OTHER" }, { expectedUpdatedAt: "invalid" },
	]) {
		await assert.rejects(updateSellerProductDetailsById({ ...base, body: { ...base.body, ...values } }, {}), { statusCode: 400 });
	}
});

test("product updates reject stale versions and other sellers", async (t) => {
	const product = prisma.product;
	const update = product.updateMany;
	const find = product.findFirst;
	t.after(() => { product.updateMany = update; product.findFirst = find; });
	const version = new Date("2026-01-01T00:00:00.000Z");
	let saved;
	product.updateMany = async ({ where, data }) => {
		if (where.sellerId !== "seller-1" || where.id !== "p1" || where.updatedAt.getTime() !== version.getTime()) return { count: 0 };
		saved = data;
		return { count: 1 };
	};
	product.findFirst = async ({ where }) => where.sellerId === "seller-1" && where.id === "p1" ? { id: "p1" } : null;
	const details = { name: "New name", price: 100, discountType: "FIXED", discountValue: 20 };
	assert.deepEqual(await updateSellerProductDetails("seller-1", "p1", version, details), { id: "p1" });
	assert.equal(saved.discountValue.toString(), "20");
	await assert.rejects(updateSellerProductDetails("seller-1", "p1", new Date(0), details), { statusCode: 409 });
	await assert.rejects(updateSellerProductDetails("other", "p1", version, details), { statusCode: 404 });
	await assert.rejects(updateSellerProductDetails("seller-1", "p1", version, { ...details, price: 0.01, discountType: "PERCENT", discountValue: 99 }), { statusCode: 400 });
});

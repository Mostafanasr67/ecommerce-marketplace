import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../src/prisma.ts";
import sellerRoutes from "../src/routes/seller.routes.ts";
import errorHandler from "../src/middleware/error.middleware.ts";

test("seller routes require authentication and enforce ownership", async () => {
	process.env.JWT_SECRET = "seller-route-test-secret";
	const originalUserFindUnique = prisma.user.findUnique;
	const originalSellerFindUnique = prisma.seller.findUnique;
	const originalProductFindMany = prisma.product.findMany;
	const originalOrderFindMany = prisma.sellerOrder.findMany;
	const seller = { id: "seller-1", userId: "user-1", storeName: "Store" };
	const calls = [];

	prisma.user.findUnique = async ({ where }) => where.id === "user-1"
		? { id: "user-1", role: "SELLER" }
		: where.id === "user-without-store" ? { id: "user-without-store", role: "SELLER" }
		: where.id === "buyer-1" ? { id: "buyer-1", role: "USER" } : null;
	prisma.seller.findUnique = async ({ where }) => where.userId === "user-1" ? seller : null;
	prisma.product.findMany = async (args) => { calls.push(args); return [{ id: "product-1" }]; };
	prisma.sellerOrder.findMany = async (args) => { calls.push(args); return [{ id: "order-1" }]; };

	const app = express();
	app.use("/seller", sellerRoutes);
	app.use(errorHandler);
	const server = app.listen(0, "127.0.0.1");

	try {
		await once(server, "listening");
		const base = `http://127.0.0.1:${server.address().port}/seller`;
		const sellerToken = jwt.sign({ userId: "user-1" }, process.env.JWT_SECRET);
		const buyerToken = jwt.sign({ userId: "buyer-1" }, process.env.JWT_SECRET);
		const noStoreToken = jwt.sign({ userId: "user-without-store" }, process.env.JWT_SECRET);
		const get = (path, token) => fetch(`${base}${path}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});

		assert.equal((await get("/user-1")).status, 401);
		assert.equal((await get("/user-1", "invalid-token")).status, 401);
		assert.equal((await get("/user-1", buyerToken)).status, 403);
		assert.equal((await get("/user-without-store", noStoreToken)).status, 404);
		assert.equal((await get("/user-2", sellerToken)).status, 403);
		assert.equal((await get("/seller-2/products", sellerToken)).status, 403);
		assert.equal((await get("/seller-2/orders", sellerToken)).status, 403);
		assert.equal(calls.length, 0);

		const profileResponse = await get("/user-1", sellerToken);
		assert.equal(profileResponse.status, 200);
		assert.deepEqual(await profileResponse.json(), seller);
		const productsResponse = await get("/seller-1/products", sellerToken);
		assert.equal(productsResponse.status, 200);
		assert.deepEqual(await productsResponse.json(), [{ id: "product-1" }]);
		const ordersResponse = await get("/seller-1/orders", sellerToken);
		assert.equal(ordersResponse.status, 200);
		assert.deepEqual(await ordersResponse.json(), [{ id: "order-1" }]);
		assert.deepEqual(calls.map((args) => args.where), [{ sellerId: "seller-1" }, { sellerId: "seller-1" }]);
		assert.equal(calls[0].include.category, true);
		assert.equal(calls[1].include.orderItems.include.product.include.category, true);
		assert.equal(calls[1].include.orderItems.include.product.include.productImages, true);
	} finally {
		await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
		prisma.user.findUnique = originalUserFindUnique;
		prisma.seller.findUnique = originalSellerFindUnique;
		prisma.product.findMany = originalProductFindMany;
		prisma.sellerOrder.findMany = originalOrderFindMany;
		await prisma.$disconnect();
	}
});

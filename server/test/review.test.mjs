import assert from "node:assert/strict";
import { test } from "node:test";
import prisma from "../src/prisma.ts";
import { getReviewsByProductId, saveReview } from "../src/services/review.service.ts";
import { saveProductReview } from "../src/controllers/review.controller.ts";

test("review listing includes aggregate rating and review count", async (t) => {
	const originalFindMany = prisma.review.findMany;
	const originalAggregate = prisma.review.aggregate;
	t.after(() => {
		prisma.review.findMany = originalFindMany;
		prisma.review.aggregate = originalAggregate;
	});

	prisma.review.findMany = async () => [{ id: "review-1", rating: 4 }];
	prisma.review.aggregate = async () => ({ _avg: { rating: 4 }, _count: { _all: 1 } });
	assert.deepEqual(await getReviewsByProductId("product-1"), {
		reviews: [{ id: "review-1", rating: 4 }],
		averageRating: 4,
		totalReviews: 1,
	});
});

test("saving a review upserts on the user and product pair", async (t) => {
	const originalFindUnique = prisma.product.findUnique;
	const originalUpsert = prisma.review.upsert;
	let upsertArgs;
	t.after(() => {
		prisma.product.findUnique = originalFindUnique;
		prisma.review.upsert = originalUpsert;
	});

	prisma.product.findUnique = async () => ({ id: "product-1" });
	prisma.review.upsert = async (args) => {
		upsertArgs = args;
		return { id: "review-1", ...args.update };
	};
	await saveReview("product-1", "user-1", { rating: 5, title: "Great", comment: "Works well" });

	assert.deepEqual(upsertArgs.where, { userId_productId: { userId: "user-1", productId: "product-1" } });
	assert.equal(upsertArgs.create.userId, "user-1");
	assert.equal(upsertArgs.update.rating, 5);
});

test("review submission validates rating and trims the saved content", async (t) => {
	const originalFindUnique = prisma.product.findUnique;
	const originalUpsert = prisma.review.upsert;
	let createdData;
	t.after(() => {
		prisma.product.findUnique = originalFindUnique;
		prisma.review.upsert = originalUpsert;
	});
	prisma.product.findUnique = async () => ({ id: "product-1" });
	prisma.review.upsert = async (args) => {
		createdData = args.create;
		return { id: "review-1", ...args.create };
	};

	await assert.rejects(
		saveProductReview({ user: { id: "user-1" }, params: { productId: "product-1" }, body: { rating: 6, comment: "Too many stars" } }, { json() {} }),
		{ statusCode: 400 },
	);
	let response;
	await saveProductReview(
		{ user: { id: "user-1" }, params: { productId: "product-1" }, body: { rating: 5, title: "  Excellent  ", comment: "  Works very well  " } },
		{ json(value) { response = value; } },
	);
	assert.equal(createdData.title, "Excellent");
	assert.equal(createdData.comment, "Works very well");
	assert.equal(response.rating, 5);
});

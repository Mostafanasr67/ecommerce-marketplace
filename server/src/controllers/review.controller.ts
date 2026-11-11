import type { Request, Response } from "express";
import { getReviewsByProductId, getReviewByUserAndProduct, saveReview } from "../services/review.service.js";
import AppError from "../utils/appError.js";

async function fetchProductReviews(req: Request, res: Response) {
	const { productId } = req.params as { productId: string };
	if (!productId) throw new AppError("Product ID is required", 400);
	res.json(await getReviewsByProductId(productId));
}

async function fetchMyProductReview(req: Request, res: Response) {
	const { productId } = req.params as { productId: string };
	const userId = req.user?.id;
	if (!productId) throw new AppError("Product ID is required", 400);
	if (!userId) throw new AppError("Unauthorized", 401);
	res.json(await getReviewByUserAndProduct(productId, userId));
}

async function saveProductReview(req: Request, res: Response) {
	const { productId } = req.params as { productId: string };
	const userId = req.user?.id;
	if (!productId) throw new AppError("Product ID is required", 400);
	if (!userId) throw new AppError("Unauthorized", 401);

	const { rating, title, comment } = req.body ?? {};
	if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
		throw new AppError("Rating must be a whole number from 1 to 5", 400);
	}
	if (title !== undefined && title !== null && (typeof title !== "string" || title.trim().length > 120)) {
		throw new AppError("Review title must be 120 characters or fewer", 400);
	}
	if (typeof comment !== "string" || !comment.trim() || comment.trim().length > 2000) {
		throw new AppError("Review comment is required and must be 2000 characters or fewer", 400);
	}

	const review = await saveReview(productId, userId, {
		rating,
		title: typeof title === "string" && title.trim() ? title.trim() : null,
		comment: comment.trim(),
	});
	res.json(review);
}

export { fetchProductReviews, fetchMyProductReview, saveProductReview };

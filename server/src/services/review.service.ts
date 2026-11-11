import prisma from "../prisma.js";
import AppError from "../utils/appError.js";

type ReviewInput = {
	rating: number;
	title: string | null;
	comment: string;
};

async function getReviewsByProductId(productId: string) {
	const [reviews, aggregate] = await Promise.all([
		prisma.review.findMany({
			where: { productId },
			orderBy: { createdAt: "desc" },
			include: { user: { select: { name: true } } },
		}),
		prisma.review.aggregate({
			where: { productId },
			_avg: { rating: true },
			_count: { _all: true },
		}),
	]);

	return {
		reviews,
		averageRating: aggregate._avg.rating ?? 0,
		totalReviews: aggregate._count._all,
	};
}

async function getReviewByUserAndProduct(productId: string, userId: string) {
	return prisma.review.findUnique({
		where: { userId_productId: { userId, productId } },
	});
}

async function saveReview(productId: string, userId: string, input: ReviewInput) {
	const product = await prisma.product.findUnique({
		where: { id: productId },
		select: { id: true },
	});
	if (!product) throw new AppError("Product not found", 404);

	return prisma.review.upsert({
		where: { userId_productId: { userId, productId } },
		create: { productId, userId, ...input },
		update: input,
		include: { user: { select: { name: true } } },
	});
}

export { getReviewsByProductId, getReviewByUserAndProduct, saveReview };

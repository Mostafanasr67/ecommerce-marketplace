export type Review = {
	id: string;
	productId: string;
	userId: string;
	rating: number;
	title: string | null;
	comment: string;
	createdAt: string;
	updatedAt: string;
	user?: { name: string | null };
};

export type ProductReviewsResponse = {
	reviews: Review[];
	averageRating: number;
	totalReviews: number;
};

export type SaveReviewInput = {
	rating: number;
	title: string | null;
	comment: string;
};

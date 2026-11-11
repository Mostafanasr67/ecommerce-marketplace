import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyProductReview, fetchProductReviews, saveProductReview } from "./ReviewHelper";
import type { Review } from "../../../types/review";

function ProductReviews({ productId }: { productId: string }) {
	const reviewsKey = ["product-reviews", productId] as const;
	const ownReviewKey = ["product-review", productId, "mine"] as const;
	const reviewsQuery = useQuery({
		queryKey: reviewsKey,
		queryFn: () => fetchProductReviews(productId),
		enabled: Boolean(productId),
	});
	const ownReviewQuery = useQuery({
		queryKey: ownReviewKey,
		queryFn: () => fetchMyProductReview(productId),
		enabled: Boolean(productId && localStorage.getItem("token")),
	});
	const reviews = reviewsQuery.data?.reviews ?? [];
	const averageRating = reviewsQuery.data?.averageRating ?? 0;
	const totalReviews = reviewsQuery.data?.totalReviews ?? 0;

	return (
		<section className="mt-12 border-t border-outline-variant/30 pt-8" aria-labelledby="product-reviews-heading">
			<h2 id="product-reviews-heading" className="text-2xl font-bold text-on-surface">Customer Reviews</h2>
			{reviewsQuery.isPending && <p className="mt-4 text-body-sm text-on-surface-variant">Loading reviews...</p>}
			{reviewsQuery.isError && <p role="alert" className="mt-4 text-body-sm text-error">Failed to load reviews: {reviewsQuery.error.message}</p>}

			{reviewsQuery.data && (
				<div className="mt-6 grid gap-8 md:grid-cols-[220px_1fr]">
					<div className="rounded-xl bg-surface-container-lowest p-space-lg">
						<p className="text-5xl font-bold text-on-surface">{averageRating.toFixed(1)}<span className="text-lg text-on-surface-variant">/5</span></p>
						<div className="mt-2 text-lg text-amber-500" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>
							{"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}
						</div>
						<p className="mt-2 text-sm text-on-surface-variant">{totalReviews} review{totalReviews === 1 ? "" : "s"}</p>
					</div>

					<div className="space-y-5">
						{reviews.length === 0 ? (
							<p className="rounded-xl bg-surface-container-lowest p-space-lg text-body-sm text-on-surface-variant">No reviews yet. Be the first to review this product.</p>
						) : reviews.map((review) => (
							<article key={review.id} className="border-b border-outline-variant/30 pb-5">
								<div className="flex flex-wrap items-center justify-between gap-space-sm">
									<h3 className="font-semibold text-on-surface">{review.user?.name || "Customer"}</h3>
									<time className="text-sm text-on-surface-variant" dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
								</div>
								<div className="mt-2 text-amber-500" aria-label={`${review.rating} out of 5 stars`}>
									{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
								</div>
								{review.title && <h4 className="mt-2 font-semibold text-on-surface">{review.title}</h4>}
								<p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-on-surface-variant">{review.comment}</p>
							</article>
						))}
					</div>
				</div>
			)}

			<section className="mt-8 rounded-xl bg-surface-container-lowest p-space-lg" aria-labelledby="write-review-heading">
				<h3 id="write-review-heading" className="font-title-md font-semibold text-on-surface">{ownReviewQuery.data ? "Update your review" : "Write a review"}</h3>
				{!localStorage.getItem("token") ? (
					<p className="mt-2 text-body-sm text-on-surface-variant">Sign in as a customer to leave a review.</p>
				) : ownReviewQuery.isPending ? (
					<p className="mt-2 text-body-sm text-on-surface-variant">Checking your review...</p>
				) : ownReviewQuery.isError ? (
					<p role="alert" className="mt-2 text-body-sm text-error">Failed to load your review: {ownReviewQuery.error.message}</p>
				) : (
					<ReviewEditor
						key={ownReviewQuery.data?.id ?? "new-review"}
						productId={productId}
						review={ownReviewQuery.data ?? null}
						reviewsKey={reviewsKey}
						ownReviewKey={ownReviewKey}
					/>
				)}
			</section>
		</section>
	);
}

function ReviewEditor({
	productId,
	review,
	reviewsKey,
	ownReviewKey,
}: {
	productId: string;
	review: Review | null;
	reviewsKey: readonly unknown[];
	ownReviewKey: readonly unknown[];
}) {
	const [rating, setRating] = useState(review?.rating ?? 0);
	const [title, setTitle] = useState(review?.title ?? "");
	const [comment, setComment] = useState(review?.comment ?? "");
	const [formError, setFormError] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const reviewMutation = useMutation({
		mutationFn: () => saveProductReview(productId, { rating, title: title.trim() || null, comment: comment.trim() }),
		onSuccess: async () => {
			setFormError(null);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: reviewsKey }),
				queryClient.invalidateQueries({ queryKey: ownReviewKey }),
			]);
		},
		onError: (error: Error) => setFormError(error.message),
	});

	function submitReview(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!rating) {
			setFormError("Choose a rating from 1 to 5 stars.");
			return;
		}
		if (!comment.trim()) {
			setFormError("Write a comment before submitting your review.");
			return;
		}
		setFormError(null);
		reviewMutation.mutate();
	}

	return (
		<form onSubmit={submitReview} className="mt-space-md flex flex-col gap-space-md">
			<fieldset disabled={reviewMutation.isPending}>
				<legend className="font-label-md font-semibold text-on-surface">Your rating</legend>
				<div className="mt-1 flex gap-1" role="radiogroup" aria-label="Rating">
					{[1, 2, 3, 4, 5].map((value) => (
						<button
							key={value}
							type="button"
							role="radio"
							aria-checked={rating === value}
							aria-label={`${value} star${value === 1 ? "" : "s"}`}
							onClick={() => setRating(value)}
							className="rounded text-3xl text-amber-500 focus-visible:outline-2 focus-visible:outline-primary"
						>
							{value <= rating ? "★" : "☆"}
						</button>
					))}
				</div>
			</fieldset>
			<label className="flex flex-col gap-1 font-label-sm text-on-surface">
				Title <span className="font-body-sm text-on-surface-variant">(optional)</span>
				<input maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} disabled={reviewMutation.isPending} className="rounded-lg border border-outline-variant px-3 py-2 font-body-md" />
			</label>
			<label className="flex flex-col gap-1 font-label-sm text-on-surface">
				Your review
				<textarea required maxLength={2000} rows={4} value={comment} onChange={(event) => setComment(event.target.value)} disabled={reviewMutation.isPending} className="resize-y rounded-lg border border-outline-variant px-3 py-2 font-body-md" />
			</label>
			{formError && <p role="alert" className="text-body-sm text-error">{formError}</p>}
			<div>
				<button type="submit" disabled={reviewMutation.isPending} className="rounded-lg bg-primary px-space-lg py-space-sm font-label-md font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-50">
					{reviewMutation.isPending ? "Saving..." : review ? "Update review" : "Submit review"}
				</button>
			</div>
		</form>
	);
}

export default ProductReviews;

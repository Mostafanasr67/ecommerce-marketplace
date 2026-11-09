import prisma from "../prisma.js";
import { customerProduct } from "../utils/productPricing.js";

async function getWishlistService(userId: string) {
	const wishlist = await prisma.wishlistItem.findMany({
		where: { userId },
		include: {
			product: {
				include: {
					seller: true,
				},
			},
		},
	});
	return wishlist.map((item) => ({ ...item, product: customerProduct(item.product) }));
}

async function addToWishlistService(userId: string, productId: string) {
	const wishlistItem = await prisma.wishlistItem.upsert({
		where: { userId_productId: { userId, productId } },
		update: {},
		create: { userId, productId },
		include: {
			product: {
				include: {
					seller: true,
				},
			},
		},
	});
	return wishlistItem;
}

async function removeFromWishlistService(userId: string, productId: string) {
	await prisma.wishlistItem.delete({
		where: { userId_productId: { userId, productId } },
	});
}

export {
	getWishlistService,
	addToWishlistService,
	removeFromWishlistService,
};

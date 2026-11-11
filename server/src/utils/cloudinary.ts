import { v2 as cloudinary } from "cloudinary";
import AppError from "./appError.js";

type CloudinaryUploadResult = {
	secure_url: string;
	public_id: string;
};

function configureCloudinary() {
	const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
	const apiKey = process.env.CLOUDINARY_API_KEY;
	const apiSecret = process.env.CLOUDINARY_API_SECRET;
	if (!cloudName || !apiKey || !apiSecret) {
		throw new AppError("Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the server.", 503);
	}
	cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
	return cloudName;
}

function uploadProductImage(buffer: Buffer, userId: string): Promise<CloudinaryUploadResult> {
	configureCloudinary();
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream({
			folder: `products/${userId}`,
			resource_type: "image",
			allowed_formats: ["jpg", "jpeg", "png", "webp"],
		}, (error, result) => {
			if (error) {
				reject(error);
				return;
			}
			if (!result?.secure_url || !result.public_id) {
				reject(new Error("Cloudinary did not return an uploaded image."));
				return;
			}
			resolve({ secure_url: result.secure_url, public_id: result.public_id });
		});
		stream.end(buffer);
	});
}

async function deleteProductImage(publicId: string, userId: string) {
	configureCloudinary();
	if (!publicId.startsWith(`products/${userId}/`)) {
		throw new AppError("You can only remove images uploaded to your own seller folder.", 403);
	}
	const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
	if (result.result !== "ok" && result.result !== "not found") {
		throw new AppError("Cloudinary could not remove the uploaded image.", 502);
	}
}

function isOwnedProductImage(url: string, publicId: string, userId: string) {
	const cloudName = configureCloudinary();
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.protocol === "https:" &&
			parsedUrl.hostname === "res.cloudinary.com" &&
			parsedUrl.pathname.startsWith(`/${cloudName}/image/upload/`) &&
			publicId.startsWith(`products/${userId}/`) &&
			!publicId.includes("..");
	} catch {
		return false;
	}
}

export { uploadProductImage, deleteProductImage, isOwnedProductImage };

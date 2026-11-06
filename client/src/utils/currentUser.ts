import { Role } from "../../../server/generated/prisma/enums";

function getCurrentUserId(): string | null {
	const userJson = localStorage.getItem("user");
	if (!userJson) return null;

	try {
		const user: unknown = JSON.parse(userJson);
		if (
			typeof user === "object" &&
			user !== null &&
			"id" in user &&
			typeof user.id === "string"
		) {
			return user.id;
		}
	} catch (error) {
		console.error("Failed to read the current user:", error);
	}

	return null;
}

function getCurrentUserRole(): Role | null {
	const userJson = localStorage.getItem("user");
	if (!userJson) return null;

	try {
		const user: unknown = JSON.parse(userJson);
		if (typeof user === "object" && user !== null && "role" in user) {
			if (user.role === Role.USER || user.role === Role.SELLER || user.role === Role.ADMIN) {
				return user.role;
			}
		}
		console.error("The current user has an invalid or missing role.");
	} catch (error) {
		console.error("Failed to read the current user's role:", error);
	}

	return null;
}

export { getCurrentUserId, getCurrentUserRole };

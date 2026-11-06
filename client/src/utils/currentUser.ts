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

export { getCurrentUserId };

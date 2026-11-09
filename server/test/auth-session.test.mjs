import assert from "node:assert/strict";
import { test } from "node:test";
import prisma from "../src/prisma.ts";
import authMiddleware from "../src/auth/auth.middleware.ts";
import roleMiddleware from "../src/middleware/role.middleware.ts";
import { createToken } from "../src/utils/jwt.ts";
import { Role } from "../generated/prisma/enums.ts";

test("authentication verifies the token and authorization uses the database role", async (t) => {
	const oldSecret = process.env.JWT_SECRET;
	process.env.JWT_SECRET = "test-only-secret";
	const user = prisma.user;
	const originalFindUnique = user.findUnique;
	t.after(() => {
		user.findUnique = originalFindUnique;
		if (oldSecret === undefined) delete process.env.JWT_SECRET;
		else process.env.JWT_SECRET = oldSecret;
	});
	user.findUnique = async ({ where }) => where.id === "user-1" ? { id: "user-1", role: Role.SELLER } : null;
	let status;
	const res = {
		status(code) { status = code; return this; },
		json(body) { return body; },
	};
	let nextCalled = false;
	await authMiddleware({ headers: { authorization: `Bearer ${createToken("user-1")}` } }, res, () => { nextCalled = true; });
	assert.equal(nextCalled, true);

	const req = { headers: { authorization: `Bearer ${createToken("user-1")}` }, user: { role: Role.ADMIN } };
	await authMiddleware(req, res, () => {});
	assert.equal(req.user.role, Role.SELLER);
	roleMiddleware(Role.USER)(req, res, () => { throw new Error("Wrong role was allowed"); });
	assert.equal(status, 403);
	status = undefined;
	await authMiddleware({ headers: { authorization: "Bearer invalid" } }, res, () => { throw new Error("Invalid token was allowed"); });
	assert.equal(status, 401);
	status = undefined;
	await authMiddleware({ headers: { authorization: `Bearer ${createToken("deleted-user")}` } }, res, () => { throw new Error("Deleted user was allowed"); });
	assert.equal(status, 401);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { getAccessRedirect, getRoleHomePath } from "../../client/src/utils/routeAccess.ts";
import { Role } from "../generated/prisma/enums.ts";

test("unauthenticated users are redirected to login for every protected role", () => {
	for (const role of [Role.USER, Role.SELLER, Role.ADMIN]) {
		assert.equal(getAccessRedirect(null, role), "/");
	}
});

test("only the required role can access a protected page", () => {
	const homes = { USER: "/home", SELLER: "/seller-dashboard", ADMIN: "/admin-dashboard" };
	for (const role of [Role.USER, Role.SELLER, Role.ADMIN]) {
		assert.equal(getRoleHomePath(role), homes[role]);
		for (const required of [Role.USER, Role.SELLER, Role.ADMIN]) {
			assert.equal(getAccessRedirect(role, required), role === required ? null : homes[role]);
		}
	}
});

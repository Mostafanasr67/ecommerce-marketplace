import { Role } from "../../../server/generated/prisma/enums";

function getRoleHomePath(role: Role): string {
	if (role === Role.SELLER) return "/seller-dashboard";
	if (role === Role.ADMIN) return "/admin-dashboard";
	return "/home";
}

function getAccessRedirect(role: Role | null, requiredRole: Role): string | null {
	if (!role) return "/";
	return role === requiredRole ? null : getRoleHomePath(role);
}

export { getRoleHomePath, getAccessRedirect };

import { useQuery } from "@tanstack/react-query";
import type { User } from "../../types/user";

const API_URL = "http://localhost:5000";

async function fetchUserProfile(): Promise<User> {
	const token = localStorage.getItem("auth_token");
	const response = await fetch(`${API_URL}/api/users/profile/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!response.ok) throw new Error("Failed to fetch user profile");
	return response.json();
}

function formatMemberSince(dateString: string): string {
	const date = new Date(dateString);
	const month = date.toLocaleString("en-US", { month: "short" });
	const year = date.getFullYear();
	return `${month}-${year}`;
}

function ProfileHeader() {
	const { data: user } = useQuery({
		queryKey: ["userProfile"],
		queryFn: fetchUserProfile,
	});

	return (
		<div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm">
			<div className="flex flex-col gap-space-md">
				<div className="flex items-center gap-space-sm">
					<span className="font-headline-md text-headline-md text-on-surface font-bold">
						{user?.name || "User"}
					</span>
					<span
						className="material-symbols-outlined text-primary text-xl"
						style={{ fontVariationSettings: "'FILL' 1" }}
						title="Identity Verified"
					>
						verified
					</span>
				</div>

				<div className="flex flex-col gap-space-xs">
					<span className="font-body-sm text-body-sm text-on-surface-variant">
						{user?.email}
					</span>
					<span className="font-label-sm text-label-sm text-on-surface-variant">
						Member since {user?.createdAt ? formatMemberSince(user.createdAt) : ""}
					</span>
				</div>
			</div>
		</div>
	);
}

export default ProfileHeader;

import { useQuery } from "@tanstack/react-query";
import type { User } from "../../types/user";

const API_URL = "http://localhost:5000";

async function fetchUserProfile(): Promise<User> {
	const token = localStorage.getItem("token");
	const response = await fetch(`${API_URL}/users/profile/me`, {
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

interface ProfileHeaderProps {
	onEditClick?: () => void;
}

function ProfileHeader({ onEditClick }: ProfileHeaderProps) {
	const { data: user } = useQuery({
		queryKey: ["userProfile"],
		queryFn: fetchUserProfile,
	});

	return (
		<div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm relative">
			{onEditClick && (
				<button
					onClick={onEditClick}
					className="absolute top-space-md right-space-md text-on-surface-variant hover:text-primary transition-colors"
					title="Edit profile"
				>
					<span className="material-symbols-outlined text-2xl">edit</span>
				</button>
			)}

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

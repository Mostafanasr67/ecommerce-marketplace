import { useQuery } from "@tanstack/react-query";
import type { User } from "../../types/user";

const API_URL = "http://localhost:5000";

async function fetchUserProfile(): Promise<User> {
	const token = localStorage.getItem("auth_token");
	const response = await fetch(`${API_URL}/users/profile/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!response.ok) throw new Error("Failed to fetch user profile");
	return response.json();
}

function ProfileHeader() {
	const { data: user } = useQuery({
		queryKey: ["userProfile"],
		queryFn: fetchUserProfile,
	});

	console.log(user);

	return (
		<div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-lg">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-md bg-surface-container-low/70 -mx-space-lg -mt-space-lg p-space-lg rounded-t-2xl">
				<div className="flex items-center gap-space-md">
					<div className="relative">
						<img
							className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-surface-container-highest"
							src={user?.avatar}
							alt={user?.name}
						/>
						<button
							className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-on-primary rounded-lg flex items-center justify-center hover:bg-primary-container shadow-sm transition-transform active:scale-95"
							title="Change Avatar"
							type="button"
						>
							<span className="material-symbols-outlined text-base">
								camera_alt
							</span>
						</button>
					</div>
					<div className="flex flex-col">
						<div className="flex items-center gap-space-xs flex-wrap">
							<span className="font-headline-md text-headline-md text-on-surface font-bold">
								{user?.name}
							</span>

							<span
								className="material-symbols-outlined text-primary text-xl"
								style={{ fontVariationSettings: "'FILL' 1" }}
								title="Identity Verified by Sovereign Trust Operations"
							>
								verified
							</span>
						</div>
						<span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
							{user?.email}
						</span>
						<div className="flex items-center gap-space-sm mt-1 text-on-surface-variant font-label-sm text-label-sm">
							<span className="flex items-center gap-1 text-emerald-700 font-semibold">
								<span
									className="material-symbols-outlined text-sm"
									style={{ fontVariationSettings: "'FILL' 1" }}
								>
									verified
								</span>
								Egyptian Telco Verified ({user?.phone})
							</span>
							<span>•</span>
							<span>Registered Member since {user?.createdAt?.split("T")[0]}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfileHeader;

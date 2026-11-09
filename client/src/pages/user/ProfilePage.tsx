import ProfileHeader from "../../components/user/profile/ProfileHeader";
import PersonalInformation from "../../components/user/profile/PersonalInformation";
import ProfileSidebar from "../../components/user/profile/ProfileSidebar";

function ProfilePage({ wishlist }: { wishlist: string[] }) {
	return (
		<main className="min-h-screen bg-surface">
			<div className="mx-auto max-w-7xl px-margin py-space-xl">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
					<aside className="lg:col-span-3">
						<ProfileSidebar wishlist={wishlist} />
					</aside>

					<section className="lg:col-span-9 flex flex-col gap-space-xl">
						<ProfileHeader />
						<PersonalInformation />
					</section>
				</div>
			</div>
		</main>
	);
}

export default ProfilePage;
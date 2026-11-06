interface AuthTabsProps {
	activeTab: "login" | "signup";
	onTabChange: (tab: "login" | "signup") => void;
}

function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
	return (
		<div className="w-full bg-surface-container-low p-1 rounded-xl flex items-center justify-between">
			<button
				onClick={() => onTabChange("login")}
				className={`flex-1 py-2 rounded-lg font-label-lg text-label-lg transition-all duration-200 flex items-center justify-center gap-1.5 font-semibold ${
					activeTab === "login"
						? "bg-surface-container-lowest text-on-surface shadow-sm"
						: "text-on-surface-variant hover:text-on-surface"
				}`}
			>
				<span className="material-symbols-outlined text-[18px] text-primary">login</span>
				<span>Log In</span>
			</button>
			<button
				onClick={() => onTabChange("signup")}
				className={`flex-1 py-2 rounded-lg font-label-lg text-label-lg transition-all duration-200 flex items-center justify-center gap-1.5 font-semibold ${
					activeTab === "signup"
						? "bg-surface-container-lowest text-on-surface shadow-sm"
						: "text-on-surface-variant hover:text-on-surface"
				}`}
			>
				<span className="material-symbols-outlined text-[18px] text-primary">person_add</span>
				<span>Sign Up</span>
			</button>
		</div>
	);
}

export default AuthTabs;

import CartItem from "./CartItem";
import type { CartItemView as CartItemType, CartPackage as CartPackageType } from "../../types/cart";

type CartPackageProps = {
	packageData: CartPackageType;
	onQuantityChange: (id: string, quantity: number) => void;
	onRemove: (id: string) => void;
	wishlist: string[];
	toggleWishlist: (productId: string) => void;
};

function CartPackage({
	packageData,
	onQuantityChange,
	onRemove,
	wishlist,
	toggleWishlist,
}: CartPackageProps) {
	return (
		<article className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">

			{packageData.items.map((item: CartItemType, index) => (
				<div key={item.id}>
					<CartItem
						item={item}
						onQuantityChange={onQuantityChange}
						onRemove={onRemove}
						wishlist={wishlist}
						toggleWishlist={toggleWishlist}
					/>
					{index < packageData.items.length - 1 && (
						<div className="h-px w-full bg-surface-container" />
					)}
				</div>
			))}
		</article>
	);
}

export default CartPackage;

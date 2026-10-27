import prisma from "../prisma.js";

// Match the Prisma schema exactly
interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

interface CartItemWithProduct extends CartItem {
    product: Product;
}

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

interface Cart {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    cartItems: CartItemWithProduct[];
}

async function getCartService(userId: string) {
    if (!userId) {
        throw new Error("User ID is required to get the cart");
    }
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
    });

    if (!cart) {
        await prisma.cart.create({
            data: {
                userId,
            },
        });
        return await prisma.cart.findUnique({
            where: { userId },
            include: { cartItems: { include: { product: true } } },
        });
    }
    return cart;
}

async function addToCartService(userId: string, productId: string, quantity: number) {
    if (!userId) {
        throw new Error("User ID is required to add to the cart");
    }
    let cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
    });
    if (!cart) {
        await prisma.cart.create({
            data: {
                userId,
            },
        });
        cart = await prisma.cart.findUnique({
            where: { userId },
            include: { cartItems: { include: { product: true } } },
        });
    }

    const existingCartItem = cart?.cartItems?.find((item: CartItem) => item.productId === productId);
    if (existingCartItem) {
        const updatedItem = await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity + quantity },
            include: { product: true },
        });
        return updatedItem as CartItem;
    } else {
        const newItem = await prisma.cartItem.create({
            data: {
                cartId: cart!.id,
                productId,
                quantity,
            },
            include: { product: true },
        });
        return newItem as CartItem;
    }
}

async function removeFromCartService(userId: string, productId: string) {
    if (!userId) {
        throw new Error("User ID is required to remove from cart");
    }
    const cart = await prisma.cart.findUnique({
        where: { userId },
    });
    if (!cart) {
        throw new Error("Cart not found");
    }
    const cartItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
    });
    if (!cartItem) {
        throw new Error("Item not found in cart");
    }
    await prisma.cartItem.delete({
        where: { id: cartItem.id },
    });
    return { success: true, message: "Item removed from cart" };
}

async function updateCartItemService(userId: string, productId: string, quantity: number) {
    if (!userId) {
        throw new Error("User ID is required to update cart");
    }
    if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
    }
    const cart = await prisma.cart.findUnique({
        where: { userId },
    });
    if (!cart) {
        throw new Error("Cart not found");
    }
    const cartItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
    });
    if (!cartItem) {
        throw new Error("Item not found in cart");
    }
    const updatedItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
        include: { product: true },
    });
    return updatedItem as CartItem;
}

async function clearCartService(userId: string) {
    if (!userId) {
        throw new Error("User ID is required to clear cart");
    }
    const cart = await prisma.cart.findUnique({
        where: { userId },
    });
    if (!cart) {
        throw new Error("Cart not found");
    }
    await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
    });
    return { success: true, message: "Cart cleared" };
}


async function calculateCartTotalService(userId: string) {
    if (!userId) {
        throw new Error("User ID is required to calculate cart total");
    }
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
    });
    if (!cart) {
        throw new Error("Cart not found");
    }
    const total = (cart.cartItems as unknown as CartItemWithProduct[]).reduce((sum: number, cartItem: CartItemWithProduct) => sum + (cartItem.quantity * parseFloat(cartItem.product.price.toString())), 0);
    return { total };
}

export {
    getCartService,
    addToCartService,
    removeFromCartService,
    updateCartItemService,
    clearCartService,
    calculateCartTotalService,
};
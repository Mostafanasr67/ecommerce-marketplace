type OrderItem = {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: string;
    product?: {
        id: string;
        name: string;
        price: string | number;
        productImages?: Array<{
            id: string;
            url: string;
            altText: string;
        }>;
    };
};

type SellerOrder = {
    id: string;
    orderId: string;
    sellerId: string;
    status: string;
    subTotal: string;
    orderItems?: OrderItem[];
};

type Payment = {
    id: string;
    orderId: string;
    method: "ONLINE" | "COD";
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    amount: string | number;
    card?: {
        id: string;
        holderName: string;
        brand: string;
        last4: string;
        expiryMonth: number;
        expiryYear: number;
    } | null;
};

type Order = {
    id: string;
    userId: string;
    status: string;
    totalAmount: string;
    fullname: string;
    phone: string;
    street: string;
    city: string;
    area: string;
    country: string;
    building: string;
    apartment: string;
    createdAt: string;
    updatedAt: string;
    sellerOrders?: SellerOrder[];
    payment?: Payment | null;
};

export type { Order, OrderItem, SellerOrder, Payment };
type OrderItem = {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: string | number;
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
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    subTotal: string | number;
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
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalAmount: string | number;
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
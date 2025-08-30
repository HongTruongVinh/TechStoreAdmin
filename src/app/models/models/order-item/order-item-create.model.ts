export interface OrderItemCreateModel {
    orderId?: string;
    productId: string;
    quantity: number;
    priceAtOrderTime: number; // Price per item
    discount: number;
    totalPrice: number;
}
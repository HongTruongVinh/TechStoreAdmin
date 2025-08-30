import { EOrderStatus, EOrderType, EPaymentMethod, EPaymentStatus } from "../../enum/etype_project.enum";
import { OrderItemModel } from "../order-item/order-item.model";

export interface OrderModel {
    orderId: string;
    customerId: string;
    customerName: string;
    customerPhonenumber: string;
    customerEmail: string;
    orderStatus: EOrderStatus; 
    shippingAddress: string;
    
    totalPrice: number;
    shippingCharge: number;
    discountAmount: number;
    finalAmount: number;
    
    createdAt: Date;
    updatedAt: Date;
    paymentMethod: EPaymentMethod;
    items: OrderItemModel[];
    orderType: EOrderType;
    paymentStatus: EPaymentStatus;
    
    shipperId?: string;
    shipperName?: string;
    trackingNumber?: string;
    shippedDate?: Date;
    estimatedArrival?: Date;
    shippingNote?: string;
    failureCount?: number;
}
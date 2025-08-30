import { EOrderStatus, EOrderType, EPaymentMethod } from "../../enum/etype_project.enum";

export interface OrderListItemModel {
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

    
    orderType: EOrderType;
    
    createdAt: Date;
    updatedAt: Date;
    paymentMethod: EPaymentMethod;
}
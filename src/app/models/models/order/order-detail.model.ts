import { EOrderStatus, EPaymentMethod } from "../../enum/etype_project.enum";
import { InvoiceModel } from "../invoice/invoice.model";
import { OrderItemModel } from "../order-item/order-item.model";
import { PaymentModel } from "../payment/payment.model";

export interface OrderDetailModel {
    orderId: string;
    customerId: string;
    customerName: string;
    customerPhonenumber: string;
    customerEmail: string;
    orderStatus: EOrderStatus; 
    shippingAddress: string;
    items: OrderItemModel[];
    totalPrice: number;
    shippingCharge: number;
    discountAmount: number;
    finalAmount: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    paymentMethod: EPaymentMethod;

    payment?: PaymentModel;
    invoice?: InvoiceModel;
    qrCode?: string;

    shipperId?: string;
    shipperName?: string;
    trackingNumber?: string;
    shippedDate?: Date;
    estimatedArrival?: Date;
    shippingNote?: string;
    failureCount?: number;
}
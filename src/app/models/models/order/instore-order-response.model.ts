import { EOrderStatus, EPaymentMethod, EPaymentStatus } from "../../enum/etype_project.enum";
import { OrderItemModel } from "../order-item/order-item.model";
import { QrcodeModel } from "../qrcode/qrcode.model";

export interface InStoreOrderResponseModel {
    orderId: string;
    customerName: string;
    customerPhonenumber: string;
    customerEmail?: string;

    totalPrice: number;
    discountAmount: number;
    finalAmount: number;

    items: OrderItemModel[];
    status: EOrderStatus;

    paymentQRCode: string;
    paymentId: string;
    paymentStatus: EPaymentStatus;
    paymentMethod: string;
    transactionCode: string;

    invoiceId: string;

    note?: string;
    createdAt: Date;
    updatedAt?: Date;
}
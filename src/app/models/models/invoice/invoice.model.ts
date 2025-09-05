import { EInvoiceStatus, EOrderType, EPaymentMethod } from "../../enum/etype_project.enum";

export interface InvoiceModel {
    invoiceId: string;
    orderId: string;

    customerName: string;
    customerPhonenumber: string;

    totalPrice: number;
    discountAmount: number;
    finalAmount: number;

    orderType: EOrderType;
    invoiceStatus: EInvoiceStatus;

    cashierName?: string;
    paidAt?: Date;

    createdAt: Date;
  }

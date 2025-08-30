import { EInvoiceStatus, EPaymentMethod } from "../../enum/etype_project.enum";

export interface InvoiceModel {
    invoiceId: string;
    orderId: string;
    totalPrice: number;
    discountAmount: number;
    finalAmount: number;
    invoiceStatus: EInvoiceStatus;
    createdAt: Date;
  }

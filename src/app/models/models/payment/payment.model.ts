import { EPaymentMethod, EPaymentStatus } from "../../enum/etype_project.enum";
import { QrcodeModel } from "../qrcode/qrcode.model";

// PaymentModel
export interface PaymentModel {
    paymentId: string;
    orderId: string;
    customerId?: string;
    customerName: string;
    customerPhonenumber: string;
    amount: number;
    paymentMethod: EPaymentMethod;
    transactionCode?: string; 
    paymentStatus: EPaymentStatus;
    createdAt?: Date;
    qrCode?: QrcodeModel; 
  }
import { EPaymentMethod } from "../../enum/etype_project.enum";
import { OrderItemCreateModel } from "../order-item/order-item-create.model";

export interface InStoreOrderCreateModel {
    customerName: string;
    customerPhonenumber: string;
    customerEmail?: string;
    voucherCode?: string;
    items: OrderItemCreateModel[];
    paymentMethod: EPaymentMethod;
}
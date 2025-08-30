import { EOrderStatus } from "../../enum/etype_project.enum";

export interface OrderStatusUpdateModel {
    orderId: string;
    orderStatus: EOrderStatus; 
}
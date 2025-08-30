import { EGender, EUserStatus } from "../../enum/etype_project.enum";

export interface CustomerListItemModel {
    UserId: string;
    firstName: string;
    lastName: string;
    name: string;

    email: string;
    address: string;
    phoneNumber: string;

    gender?: EGender;
    birthday?: Date;
    pictureUrl: string; 

    status: EUserStatus;
    createdAt: Date;

    orders: OrderHistoryModel[];
}

export interface OrderHistoryModel {
    orderId: string;
    finalAmount: number;
    orderDate: Date;
}
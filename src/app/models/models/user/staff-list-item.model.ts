import { EGender, EUserStatus } from "../../enum/etype_project.enum";

export interface StaffListItemModel {
    UserId: string;
    firstName: string;
    lastName: string;
    name: string;

    email: string;
    Address: string;
    phoneNumber: string;

    gender?: EGender;
    birthday?: Date;
    pictureUrl: string; 

    status: EUserStatus;
    createdAt: Date;
}

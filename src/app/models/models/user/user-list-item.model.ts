import { EUserStatus } from "../../enum/etype_project.enum";

export interface UserListItemModel {
    userId: string;
    firstName: string;
    lastName: string;
    name: string;

    email?: string;
    phoneNumber?: string;
    address: string;
    pictureUrl: string;
    
    status: EUserStatus;
    createdAt: Date;
}
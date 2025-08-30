import { EGender } from "../../enum/etype_project.enum";

export interface UserUpdateModel {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: EGender;
    birthday: Date;
    address: string;
}
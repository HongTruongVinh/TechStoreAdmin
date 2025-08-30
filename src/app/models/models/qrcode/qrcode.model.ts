import { EQRCodeType } from "../../enum/etype_project.enum";

export interface QrcodeModel {
    id: string;
    content: string;
    imageData: string;
    type: EQRCodeType;
    relatedId: string; 
    createdAt?: Date;
    expiredAt?: Date;
  }
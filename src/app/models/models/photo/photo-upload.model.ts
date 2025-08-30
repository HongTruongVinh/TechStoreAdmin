import { EPhotoType } from "../../enum/etype_project.enum";
import { FilemanagerModel } from "../file-manager.model";

export interface PhotoUploadModel {
    formFile: FilemanagerModel;
    photoType: EPhotoType;
}

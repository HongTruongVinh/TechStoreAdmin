import { Injectable } from "@angular/core";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { LinkSettings } from "../../library/linkseting/LinkSetting";
import { RepositoryModel } from "../../models/models/repository_base";
import { map } from "rxjs/operators";
import { FilemanagerModel } from "../../models/models/file-manager.model";
import { PhotoUploadModel } from "../../models/models/photo/photo-upload.model";
import { UploadToCloudResponseModel } from "../../models/models/photo/upload-to-cloud-response.model";

@Injectable({ providedIn: 'root' })
export class UploadFileCloudServices {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    deleteImageOnCloud(photoPublicId: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('UploadDataCloud', 'DeletePhotoCloud', photoPublicId);
        return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    createFileSoftware(model: FilemanagerModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('UploadDataCloud', 'CreateFileSoftware');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    updateInformationSoftware(model: FilemanagerModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('UploadDataCloud', 'UpdateInformationSoftware', model.id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getListFileSoftware() {
        const ApiUrl = LinkSettings.GetResLinkSetting('UploadDataCloud', 'GetListFileSoftware');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<FilemanagerModel[]>) => res));
    }

    UploadPhotoToCloud(model: PhotoUploadModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('UploadDataCloud', 'UpLoadPhotoToCloud');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<UploadToCloudResponseModel>) => res));
    }
}
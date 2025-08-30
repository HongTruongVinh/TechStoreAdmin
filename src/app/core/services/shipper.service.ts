import { Injectable } from "@angular/core";
import { LinkSettings } from "../../library/linkseting/LinkSetting";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { map } from "rxjs";
import { RepositoryModel } from "../../models/models/repository_base";

import { ShipperModel } from "../../models/models/shipper/shipper.model";
import { ShipperCreateModel } from "../../models/models/shipper/shipper-create.model";
import { ShipperUpdateModel } from "../../models/models/shipper/shipper-update.model";



@Injectable({ providedIn: 'root' })
export class ShipperService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    getAllItems() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Shipper', 'GetShippers');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<ShipperModel[]>) => res));
    }

    getItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Shipper', 'GetShipper', id, true);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<ShipperModel>) => res));
    }

    createItem(model: ShipperCreateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Shipper', 'CreateShipper');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<ShipperCreateModel>) => res));
    }

    updateItem(id: string, model: ShipperUpdateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Shipper', 'UpdateShipper', id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    deleteItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Shipper', 'DeleteShipper', id);
        return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getItemsByStatus(statusId: boolean) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Shipper', 'GetItemsByStatus', statusId, true);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<ShipperModel[]>) => res));
    }
}
import { Injectable } from "@angular/core";
import { LinkSettings } from "../../library/linkseting/LinkSetting";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { map } from "rxjs";
import { RepositoryModel } from "../../models/models/repository_base";

import { BrandModel } from "../../models/models/brand/brand.model";
import { BrandCreateModel } from "../../models/models/brand/brand-create.model";
import { BrandUpdateModel } from "../../models/models/brand/brand-update.model";


@Injectable({ providedIn: 'root' })
export class BrandService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    getAllItems() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Brand', 'GetBrands');
        var x = this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<BrandModel[]>) => res));
        return x;
    }

    getItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Brand', 'GetBrand', id, true);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<BrandModel>) => res));
    }

    createItem(model: BrandCreateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Brand', 'CreateBrand');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<BrandCreateModel>) => res));
    }

    updateItem(id: string, model: BrandUpdateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Brand', 'UpdateBrand', id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    deleteItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Brand', 'DeleteBrand', id);
        return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }
}
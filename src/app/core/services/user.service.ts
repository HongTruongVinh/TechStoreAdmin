import { Injectable } from "@angular/core";
import { LinkSettings } from "../../library/linkseting/LinkSetting";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { map } from "rxjs";
import { RepositoryModel } from "../../models/models/repository_base";

import { User } from "../../store/authentication/auth.models";
import { UserCreateModel } from "../../models/models/user/user-create.model";
import { UserUpdateModel } from "../../models/models/user/user-update.model";
import { CustomerListItemModel } from "../../models/models/user/customer-list-item.model";
import { StaffListItemModel } from "../../models/models/user/staff-list-item.model";


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    updateProfile(id: string, model: UserUpdateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('User', 'UpdateProfile', id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getCustomers() {
        const ApiUrl = LinkSettings.GetResLinkSetting('User', 'GetCustomers');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<CustomerListItemModel[]>) => res));
    }

    getStaffs() {
        const ApiUrl = LinkSettings.GetResLinkSetting('User', 'GetStaffs');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<StaffListItemModel[]>) => res));
    }

    activeUser(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('User', 'ActiveUser', id);
        return this.transferHttp.putUrl(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    banUser(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('User', 'BanUser', id);
        return this.transferHttp.putUrl(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    deleteUser(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('User', 'DeleteUser', id);
        return this.transferHttp.putUrl(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getAllItems() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Shipper', 'GetShippers');
        var x = this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<User[]>) => res));
        return x;
    }

    getItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Shipper', 'GetShipper', id, true);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<User>) => res));
    }

    updateItem(id: string, model: UserUpdateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Shipper', 'UpdateShipper', id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    deleteItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Shipper', 'DeleteShipper', id);
        return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }
}
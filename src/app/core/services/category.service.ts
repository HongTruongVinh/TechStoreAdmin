import { Injectable } from "@angular/core";
import { LinkSettings } from "../../library/linkseting/LinkSetting";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { CategoryModel } from "../../models/models/category/category.model";
import { CategoryCreateModel } from '../../models/models/category/category-create.model';
import { CategoryUpdateModel } from '../../models/models/category/category-update.model';
import { map } from "rxjs";
import { RepositoryModel } from "../../models/models/repository_base";

@Injectable({ providedIn: 'root' })
export class CategoryService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    addItem(model: CategoryCreateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Category', 'CreateCategory');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<CategoryModel>) => res));
    }

    getAllItems() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Category', 'GetCategories');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<CategoryModel[]>) => res));
    }

    getItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Category', 'GetCategory', id, true);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<CategoryModel>) => res));
    }

    // updateStatusCategories(model: CategoryUpdateModel) {
    //     const ApiUrl = LinkSettings.GetResLinkSetting('Category', 'UpdateStatusCategory', model.categoryId);
    //     return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    // }

    updateItem(id: string, model: CategoryUpdateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Category', 'UpdateCategory', id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    deleteItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Category', 'DeleteCategory', id);
        return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }
}
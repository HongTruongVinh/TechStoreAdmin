import { Injectable } from "@angular/core";
import { LinkSettings } from "../../library/linkseting/LinkSetting";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { map } from "rxjs";
import { RepositoryModel } from "../../models/models/repository_base";

import { ProductCreateModel } from "../../models/models/product/product-create.model";
import { ProductModel } from "../../models/models/product/product.model";
import { ProductUpdateModel } from "../../models/models/product/product-update.model";
import { CustomerProductListItemModel } from "../../models/models/product/customer-product-list-item.model";
import { AdminProductListItemModel } from "../../models/models/product/admin-product-list-item.model";


@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    getAllItems() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Product', 'GetAdminProducts');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<ProductModel[]>) => res));
    }

    getProductByCategoryId(categoryId: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Product', 'GetAdminProducts', categoryId, true);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<AdminProductListItemModel[]>) => res));
    }

    getItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Product', 'GetAdminProduct', id, true);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<ProductModel>) => res));
    }

    createItem(model: ProductCreateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Product', 'CreateProduct');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<ProductCreateModel>) => res));
    }

    updateItem(id: string, model: ProductUpdateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Product', 'UpdateProduct', id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    deleteItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Product', 'DeleteProduct', id);
        return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getCustomerProducts() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Product', 'GetCustomerProducts');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<CustomerProductListItemModel[]>) => res));
    }

    searchCustomerProducts() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Product', 'SearchCustomerProducts');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<CustomerProductListItemModel[]>) => res));
    }
}
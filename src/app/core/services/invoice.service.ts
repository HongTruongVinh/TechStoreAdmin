import { Injectable } from "@angular/core";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { LinkSettings } from "../../library/linkseting/LinkSetting";
import { RepositoryModel } from "../../models/models/repository_base";
import { map } from "rxjs";
import { InvoiceModel } from "../../models/models/invoice/invoice.model";
import { InvoiceStatusUpdateModel } from "../../models/models/invoice/invoice-status-update.model";



@Injectable({ providedIn: 'root' })
export class InvoiceService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }


    getAllItems() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Invoice', 'GetInvoices');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<InvoiceModel[]>) => res));
    }

    getItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Invoice', 'GetInvoice', id, true);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<InvoiceModel>) => res));
    }

    updateInvoiceStatus(id: string, model: InvoiceStatusUpdateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Invoice', 'UpdateInvoiceStatus', id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    deleteItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Invoice', 'DeleteInvoice', id);
        return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }
}
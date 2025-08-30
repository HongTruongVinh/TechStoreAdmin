import { Injectable } from "@angular/core";
import { LinkSettings } from "../../library/linkseting/LinkSetting";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { map } from "rxjs";
import { RepositoryModel } from "../../models/models/repository_base";


import { PaymentModel } from "../../models/models/payment/payment.model";
import { PaymentUpdateModel } from "../../models/models/payment/payment-update.model";


@Injectable({ providedIn: 'root' })
export class PaymentService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    getAllItems() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Payment', 'GetPayments');
        var x = this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<PaymentModel[]>) => res));
        return x;
    }

    getItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Payment', 'GetPayment', id, true);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<PaymentModel>) => res));
    }

    updateItem(id: string, model: PaymentUpdateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Payment', 'UpdatePayment', id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }
    
    checkoutPayment(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Payment', 'CheckoutPayment', id);
        return this.transferHttp.putUrl(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }
}
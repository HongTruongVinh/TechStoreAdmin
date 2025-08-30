import { Injectable } from "@angular/core";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { LinkSettings } from "../../library/linkseting/LinkSetting";
import { RepositoryModel } from "../../models/models/repository_base";
import { map } from "rxjs";

import { OrderModel } from "../../models/models/order/order.model";
import { OrderStatusUpdateModel } from "../../models/models/order/order-status-update.model";
import { EOrderStatus } from "../../models/enum/etype_project.enum";
import { CancelOrderModel } from "../../models/models/order/cancel-orser.model";
import { OrderDetailModel } from "../../models/models/order/order-detail.model";
import { UpdateOrderToDeliveringModel } from "../../models/models/order/update-order-to-delivering.model";
import { InStoreOrderCreateModel } from "../../models/models/order/instore-order-create.model";
import { InStoreOrderResponseModel } from "../../models/models/order/instore-order-response.model";
import { OrderListItemModel } from "../../models/models/order/order-list-item.model";

@Injectable({ providedIn: 'root' })
export class OrderService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }


    getAllItems() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'GetAllItems');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<OrderModel[]>) => res));
    }

    getItem(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'GetItem', id, true);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<OrderDetailModel>) => res));
    }

    updateOrderStatus(model: OrderStatusUpdateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'UpdateOrderStatus', model.orderId);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    cancelOrder(id: string, model: CancelOrderModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'CancelOrder', id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    processingOrder(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'ChangeOrderToProcessing', id);
        return this.transferHttp.putUrl(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    deliveringOrder(id: string, model: UpdateOrderToDeliveringModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'ChangeOrderToDelivering', id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    completedOrder(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'ChangeOrderToCompleted', id);
        return this.transferHttp.putUrl(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getOrdersByStatus(status: EOrderStatus) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'GetOrdersByStatus', status);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<OrderModel[]>) => res));
    }

    createInStoreOrder(model: InStoreOrderCreateModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'CreateInStoreOrder');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<string>) => res));
    }

    getInStoreOrders() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'GetInStoreOrders');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<OrderListItemModel[]>) => res));
    }

    getInStoreOrder(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'GetInStoreOrder', id);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<InStoreOrderResponseModel>) => res));
    }

    checkoutInStoreOrder(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'CheckoutInStoreOrder', id);
        return this.transferHttp.putUrl(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    confirmInStoreOrder(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'ConfirmInStoreOrder', id);
        return this.transferHttp.putUrl(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    deleteOrder(id: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Order', 'DeleteOrder', id);
        return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }
}
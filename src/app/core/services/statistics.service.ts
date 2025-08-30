import { Injectable } from "@angular/core";
import { LinkSettings } from "../../library/linkseting/LinkSetting";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { map } from "rxjs";
import { RepositoryModel } from "../../models/models/repository_base";


import { DashboardOverviewModel } from "../../models/models/statistics/dashboard-overview.model";


@Injectable({ providedIn: 'root' })
export class StatisticsService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    GetDashboardOverviewData() {
        const ApiUrl = LinkSettings.GetResLinkSetting('Statistics', 'GetDashboardOverviewData');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<DashboardOverviewModel>) => res));
    }

}
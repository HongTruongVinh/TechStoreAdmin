import { AdminProductListItemModel } from "../product/admin-product-list-item.model";
import { UserListItemModel } from "../user/user-list-item.model";
import { ChartData, RadialBarChartData } from "./chart-data.model";

export interface DashboardOverviewModel {
  processingOfPendingOrders: RadialBarChartData;
  deliveringOfProcessingOrders: RadialBarChartData;
  complatedOfDeliveringOrders: RadialBarChartData;
  categoryChartData: ChartData[];
  totalRevenueChartData: ChartData[];
  totalIncomeChartData: ChartData[];
  totalOrdersChartData: ChartData[];
  hotProducts: AdminProductListItemModel[];
  bestSellProducts: AdminProductListItemModel[];
  bestRatedProducts: AdminProductListItemModel[];
  loyalCustomer: UserListItemModel[];
  recentlyActions: ActionModel[];
}

export interface ActionModel {
  title: string;
  description: string;
  time: Date;
}
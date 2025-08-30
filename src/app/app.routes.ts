import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout/layout.component';
//import { AuthGuard } from './core/guards/auth.guard';
import { OrdersComponent } from './pages/orders/orders/orders.component';
import { CategoriesComponent } from './pages/categories/categories/categories.component';
import { ProductsComponent } from './pages/products/products/products.component';
import { BrandsComponent } from './pages/brands/brands/brands.component';
import { OrderOverviewComponent } from './pages/orders/order-overview/order-overview.component';
import { ProcessingOrdersComponent } from './pages/orders/processing-orders/processing-orders.component';
import { PendingOrdersComponent } from './pages/orders/pending-orders/pending-orders.component';
import { DeliveringOrdersComponent } from './pages/orders/delivering-orders/delivering-orders.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './layouts/authlayout/login/login.component';
import { ProfileComponent } from './pages/extraspages/profile/profile.component';
import { TestComponent } from './pages/extraspages/test/test.component';
import { ColumnChartComponent } from './pages/charts/column-chart/column-chart.component';
import { IndexComponent } from './pages/dashboards/index/index.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { UpdateProductComponent } from './pages/products/update-product/update-product.component';
import { CheckoutConfirmComponent } from './pages/extraspages/checkout/checkout-confirm/checkout-confirm.component';
import { CheckoutSuccessComponent } from './pages/extraspages/checkout/checkout-success/checkout-success.component';
import { ShippersComponent } from './pages/manager-system/shippers/shippers.component';
import { InvoicesComponent } from './pages/invoices/invoices/invoices.component';
import { PaymentsComponent } from './pages/payments/payments/payments.component';
import { CustomersComponent } from './pages/users/customers/customers.component';
import { StaffsComponent } from './pages/users/staffs/staffs.component';
import { AddOrderComponent } from './pages/orders/add-order/add-order.component';
import { CheckoutComponent } from './pages/orders/checkout/checkout.component';
import { InstoreOrdersComponent } from './pages/instore-orders/instore-orders/instore-orders.component';
import { CheckoutInstoreOrderComponent } from './pages/instore-orders/checkout-instore-order/checkout-instore-order.component';
import { InstoreOrderDetailsComponent } from './pages/instore-orders/instore-order-details/instore-order-details.component';
import { AddInstoreOrderComponent } from './pages/instore-orders/add-instore-order/add-instore-order.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: IndexComponent },

            { path: 'manage-orders/orders', component: OrdersComponent },
            { path: 'manage-orders/checkout/:id', component: CheckoutComponent },
            { path: 'manage-orders/order-overview/:id', component: OrderOverviewComponent },
            { path: 'manage-orders/pending-orders', component: PendingOrdersComponent },
            { path: 'manage-orders/processing-orders', component: ProcessingOrdersComponent },
            { path: 'manage-orders/delivering-orders', component: DeliveringOrdersComponent },

            { path: 'manage-instore-orders/instore-orders', component: InstoreOrdersComponent },
            { path: 'manage-instore-orders/instore-orders/:id', component: InstoreOrderDetailsComponent },
            { path: 'manage-instore-orders/add-instore-order', component: AddInstoreOrderComponent },
            { path: 'manage-instore-orders/checkout/:id', component: CheckoutInstoreOrderComponent },

            { path: 'manage-categories/categories', component: CategoriesComponent },
            { path: 'manage-brands/brands', component: BrandsComponent },
            { path: 'manage-shippers/shippers', component: ShippersComponent },

            { path: 'manager-product/products', component: ProductsComponent },
            { path: 'manager-product/add-product', component: AddProductComponent },
            { path: 'manager-product/update-product/:id', component: UpdateProductComponent },

            { path: 'manage-invoices/invoices', component: InvoicesComponent },
            { path: 'manage-payments/payments', component: PaymentsComponent },
            { path: 'manage-users/customers', component: CustomersComponent },
            { path: 'manage-users/staffs', component: StaffsComponent },

            { path: 'profile', component: ProfileComponent },
            { path: 'test', component: TestComponent },
            { path: 'column-chart', component: ColumnChartComponent },
        ],
    },

    {
        path: 'auth/login',
        component: LoginComponent,
    },

    {
        path: 'checkout/confirm/:paymentId',
        component: CheckoutConfirmComponent,
    },
    {
        path: 'checkout/success',
        component: CheckoutSuccessComponent,
    },

    //Redirect nếu không khớp route nào
    // {
    //     path: '**',
    //     redirectTo: 'login',
    // }
];

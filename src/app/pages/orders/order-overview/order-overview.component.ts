import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ThousandSeparatorPipe } from '../../../pipeTransform/thousandSeparator.pipe';
import { DateToStringPipe } from '../../../pipeTransform/DatePipe';
//import * as L from "leaflet";
import { BreadcrumbsComponent } from '../../../shared/breadcrumbs/breadcrumbs.component';
import { OrderService } from '../../../core/services/order.service';
import { EOrderStatus } from '../../../models/enum/etype_project.enum';
import { OrderStatusPipe } from '../../../pipeTransform/order-status.pipe';
import { InvoiceStatusPipe } from '../../../pipeTransform/invoice-status.pipe';
import {EPaymentMethodPipe} from "../../../pipeTransform/payment-method.pipe";
import { Base64ImagePipe } from "../../../pipeTransform/base64Image.pipe";
import { OrderDetailModel } from '../../../models/models/order/order-detail.model';
import { FullImageUrlPipe } from "../../../pipeTransform/full-image-url.pipe";

@Component({
  selector: 'app-order-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbsComponent,
    ThousandSeparatorPipe,
    DateToStringPipe,
    OrderStatusPipe,
    InvoiceStatusPipe,
    EPaymentMethodPipe,
    Base64ImagePipe,
    FullImageUrlPipe
],
  templateUrl: './order-overview.component.html',
  styleUrl: './order-overview.component.scss'
})
export class OrderOverviewComponent {

  breadCrumbItems!: Array<{}>;
  isLoading = false;

  orderDetail!: OrderDetailModel;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Ecommerce', active: true },
      { label: 'Order Overview', active: true }
    ];

    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id')!;
      this.titleService.setTitle(`Đơn hàng #${orderId}`);
      this.loadOrderDetails(orderId);
    });

  }

  loadOrderDetails(orderId: string) {
    this.isLoading = true;
    this.orderService.getItem(orderId).subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.orderDetail = res.data;
          this.isLoading = false;
        } else {

        }
      } else {
        this.isLoading = false;
      }
    })
  }
}

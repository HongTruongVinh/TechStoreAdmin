import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { OrderModel } from '../../../models/models/order/order.model';
import { OrderService } from '../../../core/services/order.service';
import { Router } from '@angular/router';
import { MessengerServices } from '../../../core/services/messenger.service';
import { EOrderStatus, EPaymentMethod } from '../../../models/enum/etype_project.enum';
import { DateToStringPipe } from "../../../pipeTransform/DatePipe";
import { ThousandSeparatorPipe } from "../../../pipeTransform/thousandSeparator.pipe";
import { OrderStatusPipe } from "../../../pipeTransform/order-status.pipe";
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CancelOrderModel } from '../../../models/models/order/cancel-orser.model';
import { OrderDetailModel } from '../../../models/models/order/order-detail.model';
import { EPaymentMethodPipe } from "../../../pipeTransform/payment-method.pipe";
import { FullImageUrlPipe } from "../../../pipeTransform/full-image-url.pipe";
import { ShipperService } from '../../../core/services/shipper.service';
import { ShipperModel } from '../../../models/models/shipper/shipper.model';
import { UpdateOrderToDeliveringModel } from '../../../models/models/order/update-order-to-delivering.model';

@Component({
  selector: 'app-processing-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    PaginationModule,
    ReactiveFormsModule,
    DateToStringPipe,
    ThousandSeparatorPipe,
    OrderStatusPipe,
    BreadcrumbsComponent,
    EPaymentMethodPipe,
    FullImageUrlPipe
],
  templateUrl: './processing-orders.component.html',
  styleUrl: './processing-orders.component.scss'
})
export class ProcessingOrdersComponent {
  isLoading = false;
  breadCrumbItems!: Array<{}>;
  term: any;
  masterSelected!: boolean;

  @ViewChild('updateModal', { static: false }) updateModal!: ModalDirective;

  updateOrderStatusForm!: UntypedFormGroup;
  cancelOrderForm!: UntypedFormGroup;

  allOrders: OrderModel[] = []; // Chứa toàn bộ đơn hàng từ API
  displayedOrders: any; // Chứa đơn hàng đang hiển thị trên table (ví dụ: trang 1)
  selectedOrderId: string = '';

  showInput: boolean = false;
  showBtnCancel: boolean = true;

  selectedOrder: OrderDetailModel = {
      orderId: '0',
      customerId: '0',
      customerEmail: '0',
      customerPhonenumber: '0',
      shippingAddress: '',
      orderStatus: EOrderStatus.Pending,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerName: '',
      totalPrice: 0,
      shippingCharge: 0,
      discountAmount: 0,
      finalAmount: 0,
      paymentMethod: EPaymentMethod.COD,
      items: [],
      payment: undefined,
      invoice: undefined,
      qrCode: undefined,
    };

  publicId?: string;

  shippers: ShipperModel[] = [];
  selectedShipperId: string = '';

  constructor(
    private readonly orderService: OrderService,
    private readonly shipperService: ShipperService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private readonly messengerService: MessengerServices
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Quản lý', active: true },
      { label: 'Các đơn hàng đang được xử lý', active: true }
    ];

    this.loadData();

    /**
      * Form Validation
    */
    this.cancelOrderForm = this.formBuilder.group({
      reason: [''],
    });

  }

  loadData() {
    this.isLoading = true;

    this.shipperService.getItemsByStatus(true).subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.shippers = res.data;
          this.selectedShipperId = this.shippers[0].shipperId; 
        } else {
          this.shippers = [];
        }
      } else {
        this.shippers = [];
      }
    })

    this.orderService.getOrdersByStatus(EOrderStatus.Processing).subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.allOrders = res.data;
          this.displayedOrders = res.data;
          this.displayedOrders = this.allOrders.slice(0, 10);
          this.isLoading = false;
          this.selectedOrderId = this.allOrders[0].orderId;
        } else {
          this.displayedOrders = [];
          this.allOrders = [];
        }
      } else {
        this.isLoading = false;
      }
    })
  }

  // filterdata
  filterdata() {
    if (this.term) {
      this.displayedOrders = this.allOrders.filter((el: any) => el.orderId.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.displayedOrders = this.allOrders.slice(0, 15)
    }
    // noResultElement
    this.updateNoResultDisplay();
  }


  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.displayedOrders.length === 0) {
      noResultElement.style.display = 'block';
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.style.display = 'none';
      paginationElement.classList.remove('d-none')
    }
  }

  showUpdateModal(id: string) {
    this.selectedOrderId = id;
    var dataEdit = (this.displayedOrders as OrderDetailModel[]).find(x => x.orderId == id)!;
    this.selectedOrder = dataEdit;
    this.updateModal.show();
  }

  // Page Changed
  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.displayedOrders = this.allOrders.slice(startItem, endItem);
  }

  // update order status
  deliverOrderAction() {

    var id = this.selectedOrderId;
    
    var shipperId = this.selectedShipperId;

    this.updateModal.hide();

    if (this.checkValidate(id, shipperId)) {

      const model: UpdateOrderToDeliveringModel = {
        shipperId: shipperId
      }
      
      this.orderService.deliveringOrder(id, model).subscribe((res) => {
        if (res.retCode == 0) {
          this.loadData();
          this.updateOrderStatusForm.reset();
        } else {
          this.messengerService.errorWithIssue();
        }
      });
    } else {
      this.messengerService.errorWithIssue();
    }
  }

  checkValidate(orderId: string, shipperId: string): boolean {
    if (orderId == null && orderId == "" && orderId == undefined) {
      return false;
    }

    if (shipperId == null || shipperId == "" || shipperId == undefined) {
      this.messengerService.errorNotification('Vui lòng chọn người giao hàng');
      return false;
    }

    return true;
  }

  cancelOrderStatusAction() {
    this.updateModal.hide();
    this.showInput = false;
    this.showBtnCancel = true;

    const dataInsert: CancelOrderModel = {
      reason: this.cancelOrderForm.value.reason,
    }

    this.orderService.cancelOrder(this.selectedOrderId, dataInsert).subscribe((res) => {
      if (res.retCode == 0) {
        this.loadData();
        this.cancelOrderForm.reset();
      } else {
        this.messengerService.errorWithIssue();
      }
    });


  }


  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.displayedOrders = this.displayedOrders.map((x: { states: any }) => ({ ...x, states: ev.target.checked }));

    var checkedVal: any[] = [];
    var result;
    for (var i = 0; i < this.displayedOrders.length; i++) {
      if (this.displayedOrders[i].states == true) {
        result = this.displayedOrders[i].orderId;
        checkedVal.push(result);
      }
    }

    this.checkedValGet = checkedVal;
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.displayedOrders.length; i++) {
      if (this.displayedOrders[i].states == true) {
        result = this.displayedOrders[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  // Sort Data
  direction: any = 'asc';
  onSort(column: keyof OrderModel) {
    if (this.direction == 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    const sortedArray = [...this.displayedOrders]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.displayedOrders = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
}

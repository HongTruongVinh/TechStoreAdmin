import { Component, ViewChild } from '@angular/core';
import { FormsModule, UntypedFormGroup, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MessengerServices } from '../../../core/services/messenger.service';
import { UploadFileCloudServices } from '../../../core/services/upload-file-cloud.service';
import { DateToStringPipe } from '../../../pipeTransform/DatePipe';

import { OrderService } from '../../../core/services/order.service';
import { EOrderStatus } from '../../../models/enum/etype_project.enum';
import { OrderStatusUpdateModel } from '../../../models/models/order/order-status-update.model';
import { OrderStatusPipe } from '../../../pipeTransform/order-status.pipe';
import { OrderListItemModel } from '../../../models/models/order/order-list-item.model';

@Component({
  selector: 'app-instore-orders',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BreadcrumbsComponent,
    PaginationModule,
    ModalModule,
    ReactiveFormsModule,
    DateToStringPipe,
    OrderStatusPipe,
    
  ],
  templateUrl: './instore-orders.component.html',
  styleUrl: './instore-orders.component.scss'
})
export class InstoreOrdersComponent {
isLoading = false;
  breadCrumbItems!: Array<{}>;
  term: any;
  masterSelected!: boolean;

  @ViewChild('deleteModal', { static: false }) deleteModal!: ModalDirective;

  orderForm!: UntypedFormGroup;

  allOrders: OrderListItemModel[] = []; // Chứa toàn bộ đơn hàng từ API
  displayedOrders: any; // Chứa đơn hàng đang hiển thị trên table (ví dụ: trang 1)
  selectedOrderId: string = '';
  publicId?: string;

  constructor(
    private orderService: OrderService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private readonly messengerService: MessengerServices,
    private readonly uploadDataToCloud: UploadFileCloudServices
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Quản lý', active: true },
      { label: 'Danh mục sản phẩm', active: true }
    ];

    /**
      * Form Validation
    */
    this.orderForm = this.formBuilder.group({
      orderId: [''],
      orderStatus: EOrderStatus
    });

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.orderService.getInStoreOrders().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.allOrders = res.data;
          this.displayedOrders = res.data;
          this.displayedOrders = this.allOrders.slice(0, 10);
          this.isLoading = false;
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

  // Page Changed
  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.displayedOrders = this.allOrders.slice(startItem, endItem);
  }

  goToOrders(orderId: string) {
    const url = `manage-instore-orders/checkout/${orderId}`;
    window.open(url, '_blank');
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
  onSort(column: keyof OrderListItemModel) {
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

  showDeleteModal(id: string) {
    this.selectedOrderId = id;
    this.deleteModal.show();
  }

  deleteAction() {
    this.isLoading = true;
    this.orderService.deleteOrder(this.selectedOrderId).subscribe((res) => {
      if (res.retCode == 0) {
        this.loadData();
      }
      this.deleteModal.hide();
    })
  }
}

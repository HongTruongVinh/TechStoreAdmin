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
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-orders',
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
    BsDatepickerModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  bsConfig?: Partial<BsDatepickerConfig>;
  isLoading = false;
  breadCrumbItems!: Array<{}>;
  term: any;
  masterSelected!: boolean;

  @ViewChild('addModal', { static: false }) addModal!: ModalDirective;
  @ViewChild('updateModal', { static: false }) updateModal!: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal!: ModalDirective;

  orderForm!: UntypedFormGroup;

  allOrders: OrderListItemModel[] = []; // Chứa toàn bộ đơn hàng từ API
  displayedOrders: any; // Chứa đơn hàng đang hiển thị trên table (ví dụ: trang 1)
  selectedOrderId: string = '';
  publicId?: string;
  
  selectedOrderStatus: string = '';  // Changed from number to string to match select value
  fromDate!: string;
  toDate!: string;

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
      { label: 'Đơn hàng online', active: true }
    ];

    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };

    this.orderForm = this.formBuilder.group({
      orderId: [''],
      orderStatus: EOrderStatus
    });

    this.setDateRange();

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.orderService.getAllItems().subscribe((res) => {
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

  searchData() {
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

  showEditModel(id: string) {
    this.selectedOrderId = id;
    this.updateModal.show();
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Chỉnh sửa loại sản phẩm'
    var modalButton = document.getElementById('add-btn') as HTMLAreaElement
    modalButton.innerHTML = 'Cập nhật';
    var dataEdit = (this.displayedOrders as OrderListItemModel[]).find(x => x.orderId == id);
    this.publicId = dataEdit?.orderId;
    if (dataEdit) {
      this.orderForm.patchValue(dataEdit);
    }
  }

  // Page Changed
  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.displayedOrders = this.allOrders.slice(startItem, endItem);
  }

  // update order status
  updateOrderStatusAction() {
    var id = this.orderForm.controls['orderId'].value;
    if (this.orderForm.valid) {
      this.updateModal.hide();
      const dataInsert: OrderStatusUpdateModel = {
        orderId: this.selectedOrderId,
        orderStatus: this.orderForm.value.name,
      }
      if (id != null && id != 0 && id != "" && id != undefined) {
        this.orderService.updateOrderStatus(dataInsert).subscribe((res) => {
          if (res.retCode == 0) {
            this.loadData();
            this.orderForm.reset();
          } else {
            this.messengerService.errorWithIssue();
          }
        });
      } else {
        this.messengerService.errorWithIssue();
      }
    }
  }

  goToOrders(orderId: string) {
    this.router.navigate([`/manage-orders/order-overview/${orderId}`]);
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

  setDateRange() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;

    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - diffToMonday);

    this.fromDate = this.formatDate(fromDate);
    this.toDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // VD: "2025-06-02"
  }

  filterdata() {
    if (!this.fromDate || !this.toDate) {
      this.messengerService.errorNotification('Vui lòng chọn khoảng thời gian cần lọc');
      return;
    }

    this.isLoading = true;

    try {
      // Convert dates to start of day and end of day
      const from = new Date(this.fromDate);
      from.setHours(0, 0, 0, 0);

      const to = new Date(this.toDate);
      to.setHours(23, 59, 59, 999);

      // Filter orders by date and status
      this.displayedOrders = this.allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const dateInRange = orderDate >= from && orderDate <= to;
        
        // If no status is selected (selectedOrderStatus is empty string), show all orders
        const statusMatches = this.selectedOrderStatus === '' || 
                            order.orderStatus.toString() === this.selectedOrderStatus;

        return dateInRange && statusMatches;
      });

      // Reset pagination to first page
      if (this.displayedOrders.length > 0) {
        this.displayedOrders = this.displayedOrders.slice(0, 10);
      }

    } catch (error) {
      console.error('Error filtering orders:', error);
      this.messengerService.errorNotification('Có lỗi xảy ra khi lọc đơn hàng');
    } finally {
      this.isLoading = false;
    }
  }
}

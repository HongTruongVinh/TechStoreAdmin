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
import { EInvoiceStatus, EOrderStatus, EOrderType } from '../../../models/enum/etype_project.enum';
import { OrderStatusUpdateModel } from '../../../models/models/order/order-status-update.model';
import { OrderStatusPipe } from '../../../pipeTransform/order-status.pipe';
import { OrderListItemModel } from '../../../models/models/order/order-list-item.model';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InvoiceStatusPipe } from "../../../pipeTransform/invoice-status.pipe";
import { InvoiceModel } from '../../../models/models/invoice/invoice.model';
import { InvoiceService } from '../../../core/services/invoice.service';
import { InvoiceStatusUpdateModel } from '../../../models/models/invoice/invoice-status-update.model';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BreadcrumbsComponent,
    PaginationModule,
    ModalModule,
    ReactiveFormsModule,
    DateToStringPipe,
    BsDatepickerModule,
    InvoiceStatusPipe
],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent {
  bsConfig?: Partial<BsDatepickerConfig>;
  isLoading = false;
  breadCrumbItems!: Array<{}>;
  term: any;
  masterSelected!: boolean;

  @ViewChild('updateModal', { static: false }) updateModal!: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal!: ModalDirective;

  invoiceForm!: UntypedFormGroup;

  allInvoices: InvoiceModel[] = []; // Chứa toàn bộ đơn hàng từ API
  displayedInvoices: any; // Chứa đơn hàng đang hiển thị trên table (ví dụ: trang 1)
  selectedInvoiceId: string = '';
  publicId?: string;
  
  selectedInvoiceStatus: string = '';  // Changed from number to string to match select value
  fromDate!: string;
  toDate!: string;

  constructor(
    private invoiceService: InvoiceService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private readonly messengerService: MessengerServices,
    private readonly uploadDataToCloud: UploadFileCloudServices
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Quản lý', active: true },
      { label: 'Hóa đơn', active: true }
    ];

    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };

    this.invoiceForm = this.formBuilder.group({
      invoiceId: [''],
      invoiceStatus: EInvoiceStatus
    });

    this.setDateRange();

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.invoiceService.getAllItems().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.allInvoices = res.data;
          this.displayedInvoices = res.data;
          this.displayedInvoices = this.allInvoices.slice(0, 10);
          this.isLoading = false;
        } else {
          this.displayedInvoices = [];
          this.allInvoices = [];
        }
      } else {
        this.isLoading = false;
      }
    })
  }

  searchData() {
    if (this.term) {
      this.displayedInvoices = this.allInvoices.filter((el: any) => el.orderId.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.displayedInvoices = this.allInvoices.slice(0, 15)
    }
    // noResultElement
    this.updateNoResultDisplay();
  }


  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.displayedInvoices.length === 0) {
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
    this.displayedInvoices = this.allInvoices.slice(startItem, endItem);
  }

  // update order status
  updateInvoiceStatusAction() {
    var id = this.invoiceForm.controls['invoiceId'].value;
    if (this.invoiceForm.valid) {
      this.updateModal.hide();
      const dataInsert: InvoiceStatusUpdateModel = {
        invoiceStatus: this.invoiceForm.value.invoiceStatus,
      }
      if (id != null && id != 0 && id != "" && id != undefined) {
        this.invoiceService.updateInvoiceStatus(id, dataInsert).subscribe((res) => {
          if (res.retCode == 0) {
            this.loadData();
            this.invoiceForm.reset();
          } else {
            this.messengerService.errorWithIssue();
          }
        });
      } else {
        this.messengerService.errorWithIssue();
      }
    }
  }

  goToInvoice(invoiceId: string) {
    //this.router.navigate([`/manage-invoices/invoice-overview/${invoiceId}`]);
  }

  goToOrder(orderId: string, orderType: EOrderType) {
    if (orderType === 1) {
      this.router.navigate([`/manage-instore-orders/checkout/${orderId}`]);
    } else {
      this.router.navigate([`/manage-orders/order-overview/${orderId}`]);
    }
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.displayedInvoices = this.displayedInvoices.map((x: { states: any }) => ({ ...x, states: ev.target.checked }));

    var checkedVal: any[] = [];
    var result;
    for (var i = 0; i < this.displayedInvoices.length; i++) {
      if (this.displayedInvoices[i].states == true) {
        result = this.displayedInvoices[i].orderId;
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
    for (var i = 0; i < this.displayedInvoices.length; i++) {
      if (this.displayedInvoices[i].states == true) {
        result = this.displayedInvoices[i].id;
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
    const sortedArray = [...this.displayedInvoices]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.displayedInvoices = sortedArray;
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
      this.displayedInvoices = this.allInvoices.filter(order => {
        const orderDate = new Date(order.createdAt);
        const dateInRange = orderDate >= from && orderDate <= to;
        
        // If no status is selected (selectedOrderStatus is empty string), show all orders
        const statusMatches = this.selectedInvoiceStatus === '' || 
                            order.invoiceStatus.toString() === this.selectedInvoiceStatus;

        return dateInRange && statusMatches;
      });

      // Reset pagination to first page
      if (this.displayedInvoices.length > 0) {
        this.displayedInvoices = this.displayedInvoices.slice(0, 10);
      }

    } catch (error) {
      console.error('Error filtering orders:', error);
      this.messengerService.errorNotification('Có lỗi xảy ra khi lọc đơn hàng');
    } finally {
      this.isLoading = false;
    }
  }
}

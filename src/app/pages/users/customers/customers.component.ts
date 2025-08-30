import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { BreadcrumbsComponent } from '../../../shared/breadcrumbs/breadcrumbs.component';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { FullImageUrlPipe } from '../../../pipeTransform/full-image-url.pipe';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DateToStringPipe } from '../../../pipeTransform/DatePipe';
import { SimplebarAngularModule } from 'simplebar-angular';
import { UserService } from '../../../core/services/user.service';
import { EUserStatus } from '../../../models/enum/etype_project.enum';
import { ThousandSeparatorPipe } from "../../../pipeTransform/thousandSeparator.pipe";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BreadcrumbsComponent,
    PaginationModule,
    ModalModule,
    BsDropdownModule,
    NgSelectModule,
    ReactiveFormsModule,
    FullImageUrlPipe,
    DropzoneModule,
    DateToStringPipe,
    SimplebarAngularModule,
    ThousandSeparatorPipe
],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {

  breadCrumbItems!: Array<{}>;
  isLoading: boolean = false;

  endItem: any
  displayedCustomers: any;
  customerForm!: UntypedFormGroup;
  submitted: boolean = false;
  //public Editor = ClassicEditor;
  term: any;
  allCustomers: any
  deleteId: any;

  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  customerdetail: any;


  constructor(
    private formBuilder: UntypedFormBuilder, 
    private userService: UserService,
    public store: Store) {
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Ecommerce', active: true },
      { label: 'Customers', active: true }
    ];

    this.loadData();

    /**
 * Form Validation
 */
    this.customerForm = this.formBuilder.group({
      userId: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      create_date: ['', [Validators.required]],
      status: ['', [Validators.required]],
      img: ['']
    });
  }

  loadData() {
    this.isLoading = true;

    this.userService.getCustomers().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.displayedCustomers = res.data;
          this.allCustomers = res.data;
          this.displayedCustomers = this.allCustomers.slice(0, 10);
          this.customerdetail = this.displayedCustomers[0],
          this.isLoading = false;
        } else {
          this.displayedCustomers = [];
          this.allCustomers = [];
        }
      }
    })
  }

  // Edit Customer
  editCustomer(id: any) {
    this.showModal?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Customer'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'
    document.querySelectorAll('#customer-img').forEach((element: any) => {
      element.src = this.displayedCustomers[id].img;
    });
    this.customerForm.controls['img'].setValue(this.displayedCustomers[id].img);
    this.customerForm.patchValue(this.displayedCustomers[id]);
  }

  // Add Customer
  saveCustomer() {
    this.showModal?.hide();
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      document.querySelectorAll('#customer-img').forEach((element: any) => {
        element.src = this.imageURL;
      });
      this.customerForm.controls['img'].setValue(this.imageURL);
    };
    reader.readAsDataURL(file);
  }

  // Delete Customer
  removeCustomer(id: any) {
    this.deleteId = id;
    this.deleteRecordModal?.show()
  }

  deleteCustomer() {
    this.userService.deleteUser(this.deleteId).subscribe((res) => {
      if (res.retCode == 0) {
        this.loadData();
        this.deleteRecordModal?.hide();
      }
    })
  }

  // follow unfollow button
  followbtn(ev: any) {
    ev.target.closest('button').classList.toggle('active')
  }

  // filterdata
  filterdata() {
    if (this.term) {
      this.displayedCustomers = this.allCustomers.filter((el: any) => el.email.toLowerCase().includes(this.term.toLowerCase()) 
      || el.name.toLowerCase().includes(this.term.toLowerCase())
      || el.phoneNumber.toLowerCase().includes(this.term.toLowerCase())
    )
    } else {
      this.displayedCustomers = this.allCustomers.slice(0, 10);
    }
    // noResultElement
    this.updateNoResultDisplay();
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.displayedCustomers = this.allCustomers.slice(startItem, this.endItem);
  }

  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.displayedCustomers.length === 0) {
      noResultElement.style.display = 'block';
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.style.display = 'none';
      paginationElement.classList.remove('d-none')
    }
  }

  selectstatus() {
    const status = (document.getElementById("idStatus") as HTMLInputElement).value
    if (status) {
      this.displayedCustomers = this.allCustomers.filter((data: any) => {
        return data.status == status
      })
    }
    else {
      this.displayedCustomers = this.allCustomers.slice(0, 10);
    }
  }

  // view customer detail
  viewCustomer(id: any) {
    this.customerdetail = this.displayedCustomers[id]
  }

  goToOrder(orderId: string) {
    const url = `manage-orders/order-overview/${orderId}`;
    window.open(url, '_blank');
  }
}


import { Component, ViewChild } from '@angular/core';
import { FormsModule, UntypedFormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { MessengerServices } from '../../../core/services/messenger.service';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { UploadFileCloudServices } from '../../../core/services/upload-file-cloud.service';
import { ProductModel } from '../../../models/models/product/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductUpdateModel } from '../../../models/models/product/product-update.model';
import { ProductCreateModel } from '../../../models/models/product/product-create.model';
import { CategoryModel } from '../../../models/models/category/category.model';
import { BrandModel } from '../../../models/models/brand/brand.model';
import { CategoryService } from '../../../core/services/category.service';
import { BrandService } from '../../../core/services/brand.service';
import { FullImageUrlPipe } from '../../../pipeTransform/full-image-url.pipe';
import { DateToStringPipe } from "../../../pipeTransform/DatePipe";
import { ThousandSeparatorPipe } from "../../../pipeTransform/thousandSeparator.pipe";
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
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
    ThousandSeparatorPipe
],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  isLoading = false;
  breadCrumbItems!: Array<{}>;
  term: any;
  editData: any;

  @ViewChild('addModal', { static: false }) addModal!: ModalDirective;
  @ViewChild('updateModal', { static: false }) updateModal!: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal!: ModalDirective;

  createForm!: UntypedFormGroup;
  updateForm!: UntypedFormGroup;

  uploadedFiles: any[] = [];

  masterSelected!: boolean;
  allProducts: ProductModel[] = []; // Chứa toàn bộ đơn hàng từ API
  displayedProducts: any; // Chứa đơn hàng đang hiển thị trên table (ví dụ: trang 1)
  selectedProductId: string = '';
  publicId?: string;
  deleteId: any;
  categories: CategoryModel[] = [];
  selectedCategory!: CategoryModel;
  brands: BrandModel[] = [];
  selectedBrand!: BrandModel;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private router: Router,
    private readonly messengerService: MessengerServices,
    private readonly uploadDataToCloud: UploadFileCloudServices
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Quản lý', active: true },
      { label: 'Sản phẩm', active: true }
    ];

    /**
      * Form Validation
    */
    this.createForm = this.formBuilder.group({
      categoryId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      description: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      price: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      brandId: ['', [Validators.required]],
      tag: ['', [Validators.required]],
      importPrice: ['', [Validators.required]],
      startSellingDate: ['', [Validators.required]],
      isFeatured: ['', [Validators.required]],
    });

    this.updateForm = this.formBuilder.group({
      productId: [''],
      categoryId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      description: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      price: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      brandId: ['', [Validators.required]],
      tag: ['', [Validators.required]],
      importPrice: ['', [Validators.required]],
      startSellingDate: ['', [Validators.required]],
      isFeatured: ['', [Validators.required]],
      salePrice: ['', [Validators.required]],
    });

    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.categoryService.getAllItems().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.categories = res.data;
        } else {
          this.categories = [];
        }
      }
    })

    this.brandService.getAllItems().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.brands = res.data;
        } else {
          this.brands = [];
        }
      }
    })

    this.productService.getAllItems().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.allProducts = res.data;
          this.displayedProducts = res.data;
          this.displayedProducts = this.allProducts.slice(0, 10);
          this.isLoading = false;
        } else {
          this.displayedProducts = [];
          this.allProducts = [];
        }
      } else {
        this.isLoading = false;
      }
    })


  }

  // filterdata
  filterdata() {
    if (this.term) {
      this.displayedProducts = this.allProducts.filter((el: any) => el.name.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.displayedProducts = this.allProducts.slice(0, 15)
    }
    // noResultElement
    this.updateNoResultDisplay();
  }


  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.displayedProducts.length === 0) {
      noResultElement.style.display = 'block';
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.style.display = 'none';
      paginationElement.classList.remove('d-none')
    }
  }

  showAddModal() {
    this.createForm.reset();
    this.publicId = "";
    this.addModal.show();
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Thêm loại sản phẩm'
    var modalButton = document.getElementById('add-btn') as HTMLAreaElement
    modalButton.innerHTML = 'Lưu';
  }

  showEditModal(id: string) {
    this.selectedProductId = id;
    this.updateModal.show();
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Chỉnh sửa loại sản phẩm'
    var modalButton = document.getElementById('add-btn') as HTMLAreaElement
    modalButton.innerHTML = 'Cập nhật';
    var dataEdit = (this.displayedProducts as ProductModel[]).find(x => x.productId == id);
    this.publicId = dataEdit?.productId;
    if (dataEdit) {
      this.updateForm.patchValue(dataEdit);
    }
  }

  goToAddProductPage() {
    //this.router.navigate(['manager-product/add-product']);
    const url = `manager-product/add-product`;
    window.open(url, '_blank');
  }

  goToUpdateProductPage(productId: string) {
    //this.router.navigate(['manager-product/update-product/' + productId]);
    const url = 'manager-product/update-product/' + productId;
    window.open(url, '_blank');
  }

  showDeleteModal(id: string) {
    this.deleteId = id;
    this.deleteModal.show();
  }

  // Add product
  addAction() {
    // if (this.updateForm.valid && this.checkValidate()) {
    //   this.addModal.hide();
    //   const dataInsert: ProductCreateModel = {
    //     name: this.createForm.value.name,
    //     description: this.createForm.value.description,
    //     stock: this.createForm.value.stock,
    //     price: this.createForm.value.price,
    //     categoryId: this.createForm.value.categoryId,
    //     slug: this.createForm.value.slug,
    //     brandId: this.createForm.value.branId,
    //     tag: this.createForm.value.tag,
    //     importPrice: this.createForm.value.importPrice,
    //     startSellingDate: this.createForm.value.startSellingDate,
    //     isFeatured: this.createForm.value.isFeatured,
    //   }

    //   this.productService.createItem(dataInsert).subscribe((res) => {
    //     if (res.retCode == 0) {
    //       this.loadData();
    //       this.createForm.reset();
    //     } else {
    //       this.messengerService.errorWithIssue();
    //     }
    //   });
    // }
  }

  // update product
  updateAction() {
    var id = this.updateForm.controls['productId'].value;
    if (this.updateForm.valid) {
      this.updateModal.hide();
      const dataInsert: ProductUpdateModel = {
        name: this.updateForm.value.name,
        shortDescription: this.updateForm.value.shortDescription,
        description: this.updateForm.value.description,
        stock: this.updateForm.value.stock,
        price: this.updateForm.value.price,
        categoryId: this.updateForm.value.categoryId,
        slug: this.createForm.value.slug,
        brandId: this.createForm.value.branId,
        tag: this.createForm.value.tag,
        importPrice: this.createForm.value.importPrice,
        startSellingDate: this.createForm.value.startSellingDate,
        isFeatured: this.createForm.value.isFeatured,
        salePrice: this.createForm.value.salePrice,
      }
      if (id != null && id != 0 && id != "" && id != undefined) {
        this.productService.updateItem(id, dataInsert).subscribe((res) => {
          if (res.retCode == 0) {
            this.loadData();
            this.updateForm.reset();
          } else {
            this.messengerService.errorWithIssue();
          }
        });
      } else {
        this.messengerService.errorWithIssue();
      }
    }
  }

  // delete product
  deleteAction(id: any) {
    this.productService.deleteItem(this.selectedProductId).subscribe((res) => {
      if (res.retCode == 0) {
        this.loadData();
      }
      this.deleteModal.hide();
    })
  }

  private checkValidate(): boolean {
    return true;
  }


  // Sort Data
  direction: any = 'asc';
  onSort(column: keyof ProductModel) {
    if (this.direction == 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    const sortedArray = [...this.displayedProducts]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.displayedProducts = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  // Page Changed
  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.displayedProducts = this.allProducts.slice(startItem, endItem);
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.displayedProducts = this.displayedProducts.map((x: { states: any }) => ({ ...x, states: ev.target.checked }));

    var checkedVal: any[] = [];
    var result;
    for (var i = 0; i < this.displayedProducts.length; i++) {
      if (this.displayedProducts[i].states == true) {
        result = this.displayedProducts[i].id;
        checkedVal.push(result);
      }
    }

    this.checkedValGet = checkedVal;
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  // Edit Data
  editList(id: any) {
    this.updateModal?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modal = document.getElementById('add-btn') as HTMLAreaElement
    modal.innerHTML = 'Update'

    var editData = this.displayedProducts[id]
    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.img_alt, 'size': 1024, });
    this.updateForm.patchValue(this.displayedProducts[id]);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // dropzone
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  // File Upload
  imageURL: any;
  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.uploadedFiles.push(event[0]);
      this.createForm.controls['img'].setValue(event[0].dataURL);
    }, 0);
  }

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.displayedProducts.length; i++) {
      if (this.displayedProducts[i].states == true) {
        result = this.displayedProducts[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }
}

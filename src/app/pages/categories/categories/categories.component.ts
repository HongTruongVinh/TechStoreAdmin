import { Component, ViewChild } from '@angular/core';
import { FormsModule, UntypedFormGroup, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MessengerServices } from '../../../core/services/messenger.service';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { environment } from '../../../../environments/environment';
import { UploadFileCloudServices } from '../../../core/services/upload-file-cloud.service';

import { CategoryService } from '../../../core/services/category.service';
import { CategoryModel } from '../../../models/models/category/category.model';
import { CategoryCreateModel } from '../../../models/models/category/category-create.model';
import { CategoryUpdateModel } from '../../../models/models/category/category-update.model';
import { FullImageUrlPipe } from "../../../pipeTransform/full-image-url.pipe";
import { EPhotoType } from '../../../models/enum/etype_project.enum';
import { ConvertPhotoUrl } from '../../../library/share-function/convert-image-url';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    BreadcrumbsComponent, 
    PaginationModule,
     ModalModule, 
     ReactiveFormsModule, 
     DropzoneModule, 
     FullImageUrlPipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  isLoading = false;
  breadCrumbItems!: Array<{}>;

  @ViewChild('addModal', { static: false }) addModal!: ModalDirective;
  @ViewChild('updateModal', { static: false }) updateModal!: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal!: ModalDirective;

  displayedCategories: CategoryModel[] = [];
  file!: File;
  isUploadImages = false;
  term: any;
  allCategories: CategoryModel[] = [];
  photoPublicId!: string;
  photoUrl: string = '';
  categoryId: string = '';

  categoryAddForm!: UntypedFormGroup;
  categoryUpdateForm!: UntypedFormGroup;

  constructor(
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
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
    this.categoryUpdateForm = this.formBuilder.group({
      categoryId: [''],
      photoPublicId: [],
      name: [''],
      description: [''],
      slug: [''],
    });

    this.categoryAddForm = this.formBuilder.group({
      categoryId: [''],
      photoPublicId: [],
      name: [''],
      description: [''],
      slug: [''],
    });

    this.loadDataCategory();
  }

  loadDataCategory() {
    this.isLoading = true;
    this.categoryService.getAllItems().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.displayedCategories = res.data;
          this.allCategories = res.data;
          this.displayedCategories = this.allCategories.slice(0, 10);
          this.isLoading = false;
        } else {
          this.displayedCategories = [];
          this.allCategories = [];
        }
      } else {
        this.isLoading = false;
      }
    })
  }

  showAddModal() {
    this.categoryAddForm.reset();
    this.photoPublicId = "";
    this.photoUrl = "";
    this.addModal.show();
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Thêm loại sản phẩm'
    var modalButton = document.getElementById('add-btn') as HTMLAreaElement
    modalButton.innerHTML = 'Lưu';
  }

  showUpdateModal(id: string) {
    this.categoryId = id;
    this.updateModal.show();
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Chỉnh sửa loại sản phẩm'
    var modalButton = document.getElementById('add-btn') as HTMLAreaElement
    modalButton.innerHTML = 'Cập nhật';
    var dataEdit = this.displayedCategories.find(x => x.categoryId == id);
    this.photoPublicId = dataEdit?.iconImageUrl??"";
    this.photoUrl = ConvertPhotoUrl.convertPublicIdToUrl(dataEdit?.iconImageUrl??"");
    if (dataEdit) {
      this.categoryUpdateForm.patchValue(dataEdit);
    }
  }

  showDeleteModal(id: string) {
    this.categoryId = id;
    this.deleteModal.show();
  }

  // filterdata
  filterdata() {
    if (this.term) {
      this.displayedCategories = this.allCategories.filter((el: any) => el.name.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.displayedCategories = this.allCategories.slice(0, 15)
    }
    // noResultElement
    this.updateNoResultDisplay();
  }


  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.displayedCategories.length === 0) {
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
    this.displayedCategories = this.allCategories.slice(startItem, endItem);
  }

  // Add Category
  addCategoryAction() {
    if (this.categoryAddForm.valid && this.checkValidate()) {
      this.addModal.hide();
      const dataInsert: CategoryCreateModel = {
        name: this.categoryAddForm.value.name,
        description: this.categoryAddForm.value.description,
        iconImageUrl: this.photoPublicId,
        slug: this.categoryAddForm.value.slug,
      }

      this.categoryService.addItem(dataInsert).subscribe((res) => {
        if (res.retCode == 0) {
          this.loadDataCategory();
          this.photoPublicId = "";
          this.photoUrl = "";
          this.isUploadImages = false;
          this.categoryAddForm.reset();
        } else {
          this.messengerService.errorWithIssue();
        }
      });
    }
  }

  // update Category
  updateCategoryAction() {
    var id = this.categoryUpdateForm.controls['categoryId'].value;

    if (this.categoryUpdateForm.valid && this.checkValidate()) {
      this.updateModal.hide();
      const dataInsert: CategoryUpdateModel = {
        name: this.categoryUpdateForm.value.name,
        description: this.categoryUpdateForm.value.description,
        slug: this.categoryUpdateForm.value.slug,
        iconImageUrl: this.photoPublicId,
      }

      if (id != null && id != 0 && id != "" && id != undefined) {
        this.categoryService.updateItem(id, dataInsert).subscribe((res) => {
          if (res.retCode == 0) {
          this.photoPublicId = "";
          this.photoUrl = "";
          this.isUploadImages = false;
            this.loadDataCategory();
            this.categoryUpdateForm.reset();
          } else {
            this.messengerService.errorWithIssue();
          }
        });
      } else {
        this.messengerService.errorWithIssue();
      }
    }
  }

  // delete Category
  deleteAction() {
    this.categoryService.deleteItem(this.categoryId).subscribe((res) => {
      if (res.retCode == 0) {
        this.loadDataCategory();
      }
      this.deleteModal.hide();
    })
  }

  private checkValidate(): boolean {
    if (this.photoPublicId) {
      return true;
    }
    if (this.isUploadImages) {
      return true;
    }
    return false;
  }


  // File Upload
  public dropzoneConfig: DropzoneConfigInterface = {
    url: `${environment.baseUrl}upload-to-cloud/cloudinary-request`,
    clickable: true,
    maxFiles: 1,
    addRemoveLinks: true,
    params: {
      photoType: EPhotoType.Category,
    },
    renameFile: (file) => {
      //return uuidv4().toString();
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      return Math.floor(Math.random() * 1000).toString() + ext;
    },
  };

  // File Upload
  onUploadSuccess(event: any) {
    this.file = event[0];
    this.photoPublicId = event[1].data.publicId;
    this.photoUrl = event[1].data.urlPicture;
    this.isUploadImages = true;
  }


  // File Remove
  removeFile(event: any) {
    if (this.photoPublicId) {
      if (!this.photoPublicId.includes('default')) {
        this.uploadDataToCloud.deleteImageOnCloud(this.photoPublicId).subscribe((res) => {
          if (res.retCode == 0 && res.systemMessage == "") {
            this.photoUrl = "";
            this.photoPublicId = "";
            this.isUploadImages = false;
          }
        })
      }
    } else {
      // Hiển thị lỗi hoặc không gọi API
    }


  }

  onUploadError(event: any) {
    console.error('Lỗi upload:', event);
  }

  onCloseAddModal(): void {

    if (this.photoPublicId  && this.isUploadImages) {
    this.uploadDataToCloud.deleteImageOnCloud(this.photoPublicId).subscribe((res) => {
          if (res.retCode == 0 && res.systemMessage == "") {
            this.categoryAddForm.reset();
            this.photoUrl = "";
            this.photoPublicId = "";
            this.isUploadImages = false;
          }
        })
  }

  this.addModal.hide();
}

async onCloseUpdateModal(): Promise<void> {

    if (this.photoPublicId  && this.isUploadImages) {
    this.uploadDataToCloud.deleteImageOnCloud(this.photoPublicId).subscribe((res) => {
          if (res.retCode == 0 && res.systemMessage == "") {
            this.categoryUpdateForm.reset();
            this.photoUrl = "";
            this.photoPublicId = "";
            this.isUploadImages = false;
          }
        })
  }

  this.updateModal.hide();
}


// Sort Data
  direction: any = 'asc';
  onSort(column: keyof CategoryModel) {
    if (this.direction == 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    const sortedArray = [...this.displayedCategories]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.displayedCategories = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  
}

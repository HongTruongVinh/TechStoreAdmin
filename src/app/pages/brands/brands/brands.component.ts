import { Component, ViewChild } from '@angular/core';
import { FormsModule, UntypedFormGroup, ReactiveFormsModule, UntypedFormBuilder  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MessengerServices } from '../../../core/services/messenger.service';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { environment } from '../../../../environments/environment';
import { UploadFileCloudServices } from '../../../core/services/upload-file-cloud.service';
import { BrandModel } from '../../../models/models/brand/brand.model';
import { BrandService } from '../../../core/services/brand.service';
import { BrandCreateModel } from '../../../models/models/brand/brand-create.model';
import { BrandUpdateModel } from '../../../models/models/brand/brand-update.model';
import { FullImageUrlPipe } from "../../../pipeTransform/full-image-url.pipe";
import { EPhotoType } from '../../../models/enum/etype_project.enum';
import { ConvertPhotoUrl } from '../../../library/share-function/convert-image-url';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-brands',
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
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {
isLoading = false;
  breadCrumbItems!: Array<{}>;

  @ViewChild('addModal', { static: false }) addModal!: ModalDirective;
  @ViewChild('updateModal', { static: false }) updateModal!: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal!: ModalDirective;

  displayedBrands: BrandModel[] = [];
  file!: File;
  isUploadImages = false;
  term: any;
  allBrands: BrandModel[] = [];
  photoPublicId!: string ;
  photoUrl: string = '';
  brandId: string = '';

  brandAddForm!: UntypedFormGroup;
  brandUpdateForm!: UntypedFormGroup;

  constructor(
    private brandService: BrandService,
    private formBuilder: UntypedFormBuilder,
    private readonly messengerService: MessengerServices,
    private readonly uploadDataToCloud: UploadFileCloudServices
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Quản lý', active: true },
      { label: 'Các nhãn hiệu', active: true }
    ];

    /**
      * Form Validation
    */
    this.brandAddForm = this.formBuilder.group({
      brandId: [''],
      photoPublicId: [],
      name: [''],
      slug: [''],
      description: [''],
    });

    this.brandUpdateForm = this.formBuilder.group({
      brandId: [''],
      photoPublicId: [],
      name: [''],
      slug: [''],
      description: [''],
    });

    this.loadDataBrand();
  }

  loadDataBrand() {
    this.isLoading = true;
    this.brandService.getAllItems().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.displayedBrands = res.data;
          this.allBrands = res.data;
          this.displayedBrands = this.allBrands.slice(0, 10);
          this.isLoading = false;
        } else {
          this.displayedBrands = [];
          this.allBrands = [];
        }
      } else {
        this.isLoading = false;
      }
    })
  }

  showAddModal() {
    this.brandUpdateForm.reset();
    this.photoPublicId = "";
    this.photoUrl = "";
    this.addModal.show();
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Thêm nhãn hiệu'
    var modalButton = document.getElementById('add-btn') as HTMLAreaElement
    modalButton.innerHTML = 'Lưu';
  }

  showUpdateModal(id: string) {
    this.brandId = id;
    this.updateModal.show();
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Chỉnh sửa nhãn hiệu'
    var modalButton = document.getElementById('add-btn') as HTMLAreaElement
    modalButton.innerHTML = 'Cập nhật';
    var dataEdit = this.displayedBrands.find(x => x.brandId == id);
    this.photoPublicId = dataEdit?.iconImageUrl??"";
    this.photoUrl = ConvertPhotoUrl.convertPublicIdToUrl(dataEdit?.iconImageUrl??"");
    if (dataEdit) {
      this.brandUpdateForm.patchValue(dataEdit);
    }
  }

  showDeleteModal(id: string) {
    this.brandId = id;
    this.deleteModal.show();
  }

  // filterdata
  filterdata() {
    if (this.term) {
      this.displayedBrands = this.allBrands.filter((el: any) => el.name.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.displayedBrands = this.allBrands.slice(0, 15)
    }
    // noResultElement
    this.updateNoResultDisplay();
  }


  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.displayedBrands.length === 0) {
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
    this.displayedBrands = this.allBrands.slice(startItem, endItem);
  }

  // Add Brand
  addBrandAction() {
    if (this.brandAddForm.valid && this.checkValidate()) {
      this.addModal.hide();
      const dataInsert: BrandCreateModel = {
        name: this.brandAddForm.value.name,
        description: this.brandAddForm.value.description,
        slug: this.brandAddForm.value.slug,
        iconImageUrl: this.photoPublicId,
      }

      this.brandService.createItem(dataInsert).subscribe((res) => {
        if (res.retCode == 0) {
          this.loadDataBrand();
          this.brandAddForm.reset();
        } else {
          this.messengerService.errorWithIssue();
        }
      });
    }
  }

  // update Brand
  updateBrandAction() {
    var id = this.brandUpdateForm.controls['brandId'].value;
    if (this.brandUpdateForm.valid && this.checkValidate()) {
      this.updateModal.hide();
      const dataInsert: BrandUpdateModel = {
        name: this.brandUpdateForm.value.name,
        description: this.brandUpdateForm.value.description,
        slug: this.brandUpdateForm.value.slug,
        iconImageUrl: this.photoPublicId,
      }
      if (id != null && id != 0 && id != "" && id != undefined) {
        this.brandService.updateItem(id, dataInsert).subscribe((res) => {
          if (res.retCode == 0) {
            this.loadDataBrand();
            this.brandUpdateForm.reset();
          } else {
            this.messengerService.errorWithIssue();
          }
        });
      } else {
        this.messengerService.errorWithIssue();
      }
    }
  }

  // delete Brand
  deleteAction() {
    this.brandService.deleteItem(this.brandId).subscribe((res) => {
      if (res.retCode == 0) {
        this.loadDataBrand();
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
        photoType: EPhotoType.Brand,
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
              this.brandAddForm.reset();
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
              this.brandUpdateForm.reset();
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
  onSort(column: keyof BrandModel) {
    if (this.direction == 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    const sortedArray = [...this.displayedBrands]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.displayedBrands = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

}

import { Component, ViewChild } from '@angular/core';
import { FormsModule, UntypedFormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MessengerServices } from '../../../core/services/messenger.service';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { environment } from '../../../../environments/environment';
import { UploadFileCloudServices } from '../../../core/services/upload-file-cloud.service';
import { FullImageUrlPipe } from "../../../pipeTransform/full-image-url.pipe";
import { EPhotoType } from '../../../models/enum/etype_project.enum';
import { ConvertPhotoUrl } from '../../../library/share-function/convert-image-url';

import { ShipperService } from '../../../core/services/shipper.service';
import { ShipperCreateModel } from '../../../models/models/shipper/shipper-create.model';
import { ShipperUpdateModel } from '../../../models/models/shipper/shipper-update.model';
import { ShipperModel }       from '../../../models/models/shipper/shipper.model';

@Component({
  selector: 'app-shippers',
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
  templateUrl: './shippers.component.html',
  styleUrl: './shippers.component.scss'
})
export class ShippersComponent {

isLoading = false;
  breadCrumbItems!: Array<{}>;

  @ViewChild('addModal', { static: false }) addModal!: ModalDirective;
  @ViewChild('updateModal', { static: false }) updateModal!: ModalDirective;
  @ViewChild('deleteModal', { static: false }) deleteModal!: ModalDirective;

  displayedItems: any;
  file!: File;
  isUploadImages = false;
  term: any;
  allItems: ShipperModel[] = [];
  photoPublicId!: string ;
  photoUrl: string = '';
  shipperId: string = '';

  addForm!: UntypedFormGroup;
  updateForm!: UntypedFormGroup;

  constructor(
    private shipperService: ShipperService,
    private formBuilder: UntypedFormBuilder,
    private readonly messengerService: MessengerServices,
    private readonly uploadDataToCloud: UploadFileCloudServices
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Quản lý', active: true },
      { label: 'Các đơn vị vận chuyển', active: true }
    ];

    /**
      * Form Validation
    */
    this.addForm = this.formBuilder.group({
      photoPublicId: [],
      name: ['', Validators.required],
      website: ['', Validators.required],
      supportPhone: ['', Validators.required],
      description: [''],
    });

    this.updateForm = this.formBuilder.group({
      shipperId: ['', Validators.required],
      photoPublicId: [],
      name: ['', Validators.required],
      website: ['', Validators.required],
      supportPhone: ['', Validators.required],
      description: [''],
    });

    this.loadDataBrand();
  }

  loadDataBrand() {
    this.isLoading = true;
    this.shipperService.getAllItems().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.displayedItems = res.data;
          this.allItems = res.data;
          this.displayedItems = this.allItems.slice(0, 10);
          this.isLoading = false;
        } else {
          this.displayedItems = [];
          this.allItems = [];
        }
      } else {
        this.isLoading = false;
      }
    })
  }

  showAddModal() {
    this.updateForm.reset();
    this.photoPublicId = "";
    this.photoUrl = "";
    this.addModal.show();
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Thêm đơn vị vạn chuyển'
    var modalButton = document.getElementById('add-btn') as HTMLAreaElement
    modalButton.innerHTML = 'Lưu';
  }

  showUpdateModal(id: string) {
    this.shipperId = id;
    this.updateModal.show();
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Chỉnh sửa đơn vị vạn chuyển'
    var modalButton = document.getElementById('add-btn') as HTMLAreaElement
    modalButton.innerHTML = 'Cập nhật';
    var dataEdit = (this.displayedItems as ShipperModel[]).find(x => x.shipperId == id);
    this.photoPublicId = dataEdit?.logoUrl ?? "";
    this.photoUrl = ConvertPhotoUrl.convertPublicIdToUrl(dataEdit?.logoUrl??"");
    if (dataEdit) {
      this.updateForm.patchValue(dataEdit);
    }
  }

  showDeleteModal(id: string) {
    this.shipperId = id;
    this.deleteModal.show();
  }

  // filterdata
  filterdata() {
    if (this.term) {
      this.displayedItems = this.allItems.filter((el: any) => el.name.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.displayedItems = this.allItems.slice(0, 15)
    }
    // noResultElement
    this.updateNoResultDisplay();
  }


  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.displayedItems.length === 0) {
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
    this.displayedItems = this.allItems.slice(startItem, endItem);
  }

  // Add Brand
  addAction() {
    if (this.addForm.valid && this.checkValidate()) {
      this.addModal.hide();
      const dataInsert: ShipperCreateModel = {
        name: this.addForm.value.name,
        description: this.addForm.value.description,
        website: this.addForm.value.website,
        supportPhone: this.addForm.value.supportPhone,
        isActive: true,
        logoUrl: this.photoPublicId,
      }

      this.shipperService.createItem(dataInsert).subscribe((res) => {
        if (res.retCode == 0) {
          this.loadDataBrand();
          this.addForm.reset();
        } else {
          this.messengerService.errorWithIssue();
        }
      });
    }
  }

  // update Brand
  updateAction() {
    var id = this.updateForm.controls['shipperId'].value;
    if (this.updateForm.valid && this.checkValidate()) {
      this.updateModal.hide();
      const dataInsert: ShipperUpdateModel = {
        name: this.updateForm.value.name,
        description: this.updateForm.value.description,
        website: this.updateForm.value.website,
        supportPhone: this.updateForm.value.supportPhone,
        isActive: true,
        logoUrl: this.photoPublicId,
      }
      if (id != null && id != 0 && id != "" && id != undefined) {
        this.shipperService.updateItem(id, dataInsert).subscribe((res) => {
          if (res.retCode == 0) {
            this.loadDataBrand();
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

  // delete Brand
  deleteAction() {
    this.shipperService.deleteItem(this.shipperId).subscribe((res) => {
      if (res.retCode == 0) {
        this.loadDataBrand();
      }
      this.deleteModal.hide();
    })
  }

  private checkValidate(): boolean {
      // if (this.photoPublicId == '' || !this.isUploadImages) {
      //   this.messengerService.errorNotification('Vui long tải lên logo đơn vị vận chuyển');
      //   return false;
      // }

      // if (data.name === '' || data.name === null || data.name === undefined) {
      //   this.messengerService.errorNotification('Tên đơn vị vận chuyển không được để trống');
      //   return false;
      // }

      // if (data.website === '' || data.website === null || data.website === undefined) {
      //   this.messengerService.errorNotification('Website đơn vị vận chuyển không được để trống');
      //   return false;
      // }

      // if (data.supportPhone === '' || data.supportPhone === null || data.supportPhone === undefined) {
      //   this.messengerService.errorNotification('Số điện thoại hỗ trợ không được để trống');
      //   return false;
      // }

      return true;
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
              this.addForm.reset();
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
              this.updateForm.reset();
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
  onSort(column: keyof ShipperModel) {
    if (this.direction == 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    const sortedArray = [...this.displayedItems]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.displayedItems = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

}


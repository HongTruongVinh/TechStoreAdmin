import { Component } from '@angular/core';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditorStandalone } from '../../../shared/ckeditor/ckeditor-standalone';
import { NgSelectModule } from '@ng-select/ng-select';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DateToStringPipe } from "../../../pipeTransform/DatePipe";
import { ProductCreateModel } from '../../../models/models/product/product-create.model';
import { CommonModule } from '@angular/common';
import { CategoryModel } from '../../../models/models/category/category.model';
import { BrandModel } from '../../../models/models/brand/brand.model';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { BrandService } from '../../../core/services/brand.service';
import { MessengerServices } from '../../../core/services/messenger.service';
import { UploadFileCloudServices } from '../../../core/services/upload-file-cloud.service';
import { environment } from '../../../../environments/environment';
import { EPhotoType } from '../../../models/enum/etype_project.enum';
import { FullImageUrlPipe } from "../../../pipeTransform/full-image-url.pipe";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    DropzoneModule,
    FormsModule,
    BsDatepickerModule,
    NgSelectModule,
    CKEditorStandalone,
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    FullImageUrlPipe
],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {

  breadCrumbItems!: Array<{}>;
  isLoading = false;

  public Editor: any = ClassicEditor;
  public editorData = '';
  public editorConfig = {
    placeholder: 'Nhập nội dung mô tả sản phẩm...',
    toolbar: ['bold', 'italic', 'link', 'undo', 'redo']
  };


  categories: CategoryModel[] = [];
  selectedCategory!: CategoryModel;
  brands: BrandModel[] = [];
  selectedBrand!: BrandModel;

  productForm!: UntypedFormGroup;

  thumbnailPublicId!: string;
  thumbnailUrl: string = '';
  thumbnailFile!: File;
  isUploadThumbnail = false;

  galleryImagePublicId: string[] = [];

  bsConfig?: Partial<BsDatepickerConfig>;

  isSale = false;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private readonly messengerService: MessengerServices,
    private readonly uploadDataToCloud: UploadFileCloudServices
  ) { }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Ecommerce', active: true },
      { label: 'Add Product', active: true }
    ];

    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };


    this.productForm = this.formBuilder.group({
      categoryId: ['', Validators.required],
      brandId: ['', Validators.required],
      name: ['Samsung S30', Validators.required],

      shortDescription: ['shortDescription', Validators.required],
      description: ['description', Validators.required],
      stock: ['19', Validators.required],

      price: ['20000', Validators.required],
      slug: [''],
      tag: ['samsung s1'],

      importPrice: ['10000', Validators.required],
      startSellingDate: ['', Validators.required],
      endSellingDate: [null],

      salePrice: [''],
      saleStart: [null],
      saleEnd: [null],

      isFeatured: [false],
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
  
  
    }
  
    onSubmit() {
  
      if (this.productForm.invalid || this.checkValidate() == false) {
        return;
      }
  
      this.galleryImagePublicId = this.imageFiles.map(item => item.publicId);
  
      const formValue = this.productForm.value;
  
      const payload = {
        ...formValue,
        mainImageUrl: this.thumbnailPublicId,
        galleryImageUrls: this.galleryImagePublicId,
        stock: Number(formValue.stock),
        price: Number(formValue.price),
        importPrice: Number(formValue.importPrice),
        salePrice: Number(formValue.salePrice),
        isFeatured: formValue.isFeatured === true || formValue.isFeatured === 'true',
        tag: Array.isArray(formValue.tag)
          ? formValue.tag
          : (formValue.tag || '').split(',').map((t: string) => t.trim()),
      };
  
      this.productService.createItem(payload).subscribe((res) => {
        if (res.retCode == 0) {
          this.messengerService.successes("Cập nhật thông tin sản phẩm thành công!");
        } else {
          this.messengerService.errorWithIssue();
        }
      });
  
    }
  
    checkValidate(){
      if(this.thumbnailPublicId == "" || this.thumbnailPublicId == null || this.thumbnailPublicId == undefined){
        this.messengerService.errorNotification("Xin hãy cập nhật ảnh Thumbnail");
        return false;
      }
  
      if(this.imageFiles.length < 1){
        this.messengerService.errorNotification("Xin hãy cập nhật ít nhất 1 hình ảnh minh họa của sản phẩm");
        return false;
      }
  
      return true;
    }
  
    // File Upload
    public imagesDropzoneConfig: DropzoneConfigInterface = {
      url: `${environment.baseUrl}upload-to-cloud/cloudinary-request`,
      clickable: true,
      addRemoveLinks: true,
      previewsContainer: false,
      maxFiles: 10,
    };
  
    imageFiles: any[] = [];
  
  
    // File Upload
    imageURL: any;
    onUploadImageSuccess(event: any) {
      setTimeout(() => {
        const file = event[0];
        const publicId = event[1].data.publicId;
  
        this.imageFiles.push({ file, publicId });
      }, 0);
    }
  
    // File Remove
    removeImageFile(fileToRemove: any) {
      const index = this.imageFiles.findIndex(x => x.publicId === fileToRemove.publicId);
      if (index !== -1) {
        const removedItem = this.imageFiles.splice(index, 1)[0]; // remove và lấy object chứa cả file + publicId
  
        // this.uploadDataToCloud.deleteImageOnCloud(removedItem.publicId).subscribe((res) => {
        //   if (res.retCode == 0) {
            
        //   }
        // })
      }
    }
  
  
    public thumbnailDropzoneConfig: DropzoneConfigInterface = {
      url: `${environment.baseUrl}upload-to-cloud/cloudinary-request`,
      clickable: true,
      maxFiles: 1,
      addRemoveLinks: true,
      params: {
        photoType: EPhotoType.Product,
      },
      renameFile: (file) => {
        //return uuidv4().toString();
        const ext = file.name.substring(file.name.lastIndexOf('.'));
        return Math.floor(Math.random() * 1000).toString() + ext;
      },
    };
  
    // File Upload
    onUploadThumbnailSuccess(event: any) {
      this.thumbnailFile = event[0];
      this.thumbnailPublicId = event[1].data.publicId;
      this.thumbnailUrl = event[1].data.urlPicture;
      this.isUploadThumbnail = true;
    }
  
    // File Remove
    removeThumbnail(event: any) {
      if (this.thumbnailPublicId) {
        if (!this.thumbnailPublicId.includes('default')) {
          this.uploadDataToCloud.deleteImageOnCloud(this.thumbnailPublicId).subscribe((res) => {
            if (res.retCode == 0 && res.systemMessage == "") {
              this.thumbnailUrl = "";
              this.thumbnailPublicId = "";
              this.isUploadThumbnail = false;
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
}

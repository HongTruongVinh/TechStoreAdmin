import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { User } from '../../../store/authentication/auth.models';
import { UserUpdateModel } from '../../../models/models/user/user-update.model';
import { EGender } from '../../../models/enum/etype_project.enum';
import { UserService } from '../../../core/services/user.service';
import { MessengerServices } from '../../../core/services/messenger.service';
import { DateToStringPipe } from '../../../pipeTransform/DatePipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    BsDatepickerModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    DateToStringPipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  username: string = '...';
  roleName: string = '...';

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  fieldTextType!: boolean;
  fieldTextType1!: boolean;
  fieldTextType2!: boolean;
  bsConfig?: Partial<BsDatepickerConfig>;

  formGroups: FormGroup[] = [];
  profileForm!: FormGroup;
  currentTab = 'personalDetails';
  isEditMode = false;
  originalProfileData : any;

  constructor(
    private formBuilder: FormBuilder,
    private readonly tokenStorageService: TokenStorageService,
    private readonly userService: UserService,
    private readonly messengerService: MessengerServices,
  ) { }

  ngOnInit(): void {

    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
    
    this.breadCrumbItems = [
      { label: 'Pages', active: true },
      { label: 'Profile Settings', active: true }
    ];

    this.profileForm = this.formBuilder.group({
    firstName: [{ value: '', disabled: true }],
    lastName: [{ value: '', disabled: true }],
    phoneNumber: [{ value: '', disabled: true }],
    email: [{ value: '', disabled: true }],
    birthday: [{ value: '', disabled: true }],
    createdAt: [{ value: '', disabled: true }],
    address: [{ value: '', disabled: true }]
  });
    //this.formGroups.push(this.educationForm);

    const user = this.tokenStorageService.getUser();
    if (user) {
      this.profileForm.patchValue(user);
      this.username = user.lastName + " " + user.firstName;
      this.roleName = user.roleName;
      this.originalProfileData = user;
    }
  }

  updateProfileAction() {
    const user = this.tokenStorageService.getUser();
    var id = user?.userId;

    if (this.profileForm.valid) {
      const dataInsert: UserUpdateModel = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        phoneNumber: this.profileForm.value.phoneNumber,
        email: this.profileForm.value.email,
        address: this.profileForm.value.address,
        birthday: this.profileForm.value.birthday,
        gender: EGender.Male
      }
      if (id != null && id != "" && id != undefined) {
        this.userService.updateProfile(id, dataInsert).subscribe((res) => {
          if (res.retCode == 0) {
            this.messengerService.successes("Cập nhật thành công");
          } else {
            this.messengerService.errorWithIssue();
          }
        });
      } else {
        this.messengerService.errorWithIssue();
      }
    }
  }

  /**
  * Default Select2
  */
  selectedAccount = 'This is a placeholder';

  // Change Tab Content
  changeTab(tab: string) {
    this.currentTab = tab;
  }

  // File Upload
  imageURL: any;
  fileChange(event: any, id: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      if (id == '0') {
        document.querySelectorAll('#cover-img').forEach((element: any) => {
          element.src = this.imageURL;
        });
      }
      if (id == '1') {
        document.querySelectorAll('#user-img').forEach((element: any) => {
          element.src = this.imageURL;
        });
      }
    }

    reader.readAsDataURL(file)
  }

  /**
  * Password Hide/Show
  */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1
  }
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  // add Form
  addForm() {
    const formGroupClone = this.formBuilder.group(this.profileForm.value);
    this.formGroups.push(formGroupClone);
  }

  // Delete Form
  deleteForm(id: any) {
    this.formGroups.splice(id, 1)
  }

  enableEditMode() {
  this.isEditMode = true;
  this.profileForm.enable(); // Cho phép nhập liệu FormControl
}

cancelEdit() {
  this.isEditMode = false;
  this.profileForm.disable(); // Vô hiệu hóa FormControl
  this.profileForm.reset(this.originalProfileData); // Hoặc patch lại dữ liệu ban đầu
}

}

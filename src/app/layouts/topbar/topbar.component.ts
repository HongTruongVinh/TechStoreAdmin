import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EventService } from '../../core/services/event.service';
import { LanguageService } from '../../core/services/language.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RootReducerState } from '../../store';
import { Store } from '@ngrx/store';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { cartList, notification } from './data';
import { changeMode } from '../../store/layouts/layout-action';
import { getLayoutmode } from '../../store/layouts/layout-selector';
import { SimplebarAngularModule } from 'simplebar-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [FormsModule, CommonModule, SimplebarAngularModule, BsDropdownModule, ModalModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  country: any;
  selectedItem!: any;

  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData: any;

  element: any;
  mode: string | undefined;

  total: any;
  subtotal: any = 0;
  totalsum: any;
  taxRate: any = 0.125;
  shippingRate: any = '65.00';
  discountRate: any = 0.15;
  discount: any;
  tax: any;

  notificationList: any;

  @Output() mobileMenuButtonClicked = new EventEmitter();
  @ViewChild('removeNotificationModal', { static: false })
  removeNotificationModal?: ModalDirective;
  @ViewChild('removeCartModal', { static: false })
  removeCartModal?: ModalDirective;
  deleteid: any;
  totalNotify: number = 0;
  newNotify: number = 0;
  readNotify: number = 0;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventService: EventService,
    public languageService: LanguageService,
    //private authService: AuthenticationService,
    private router: Router,
    public _cookiesService: CookieService,
    public store: Store<RootReducerState>,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.element = document.documentElement;
    this.userData = this.tokenStorageService.getUser();
    this.subtotal = this.subtotal.toFixed(2);
    this.discount = (this.subtotal * this.discountRate).toFixed(2);
    this.tax = (this.subtotal * this.taxRate).toFixed(2);
    this.totalsum = (
      parseFloat(this.subtotal) +
      parseFloat(this.tax) +
      parseFloat(this.shippingRate) -
      parseFloat(this.discount)
    ).toFixed(2);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        this.changeTheme(savedTheme);
    }

    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter((x) => x.lang === this.cookieValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = 'assets/images/flags/vn.svg';
      }
      this.countryName = 'Tiếng Việt';
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }

    this.notificationList = notification;
    this.notificationList.forEach((element: any) => {
      this.totalNotify += element.items.length;
      if (element.title == 'New') {
        this.newNotify = element.items.length;
      } else {
        this.readNotify = element.items.length;
      }
    });
  }

  windowScroll() {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      (document.getElementById('back-to-top') as HTMLElement).style.display =
        'block';
      document.getElementById('page-topbar')?.classList.add('topbar-shadow');
    } else {
      (document.getElementById('back-to-top') as HTMLElement).style.display =
        'none';
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow');
    }
  }

  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    this.mode = mode;
    if (mode == 'auto') {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      document.documentElement.setAttribute('data-topbar', 'light');
      document.documentElement.classList.add('mode-auto');
    } else {
      this.store.dispatch(changeMode({ mode }));
      this.store.select(getLayoutmode).subscribe((mode) => {
        document.documentElement.setAttribute('data-bs-theme', mode);
      });
      document.documentElement.classList.remove('mode-auto');
      document.documentElement.setAttribute('data-topbar', mode);
    }
  }

  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Tiếng Việt', flag: 'assets/images/flags/vn.svg', lang: 'vn' },
  ];

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open');
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  // Search Topbar
  Search() {
    var searchOptions = document.getElementById(
      'search-close-options'
    ) as HTMLAreaElement;
    var dropdown = document.getElementById(
      'search-dropdown'
    ) as HTMLAreaElement;
    var input: any,
      filter: any,
      ul: any,
      li: any,
      a: any | undefined,
      i: any,
      txtValue: any;
    input = document.getElementById('search-options') as HTMLAreaElement;
    filter = input.value.toUpperCase();
    var inputLength = filter.length;

    if (inputLength > 0) {
      dropdown.classList.add('show');
      searchOptions.classList.remove('d-none');
      var inputVal = input.value.toUpperCase();
      var notifyItem = document.getElementsByClassName('notify-item');

      Array.from(notifyItem).forEach(function (element: any) {
        var notifiTxt = '';
        if (element.querySelector('h6')) {
          var spantext = element
            .getElementsByTagName('span')[0]
            .innerText.toLowerCase();
          var name = element.querySelector('h6').innerText.toLowerCase();
          if (name.includes(inputVal)) {
            notifiTxt = name;
          } else {
            notifiTxt = spantext;
          }
        } else if (element.getElementsByTagName('span')) {
          notifiTxt = element
            .getElementsByTagName('span')[0]
            .innerText.toLowerCase();
        }
        if (notifiTxt)
          element.style.display = notifiTxt.includes(inputVal)
            ? 'block'
            : 'none';
      });
    } else {
      dropdown.classList.remove('show');
      searchOptions.classList.add('d-none');
    }
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    var searchOptions = document.getElementById(
      'search-close-options'
    ) as HTMLAreaElement;
    var dropdown = document.getElementById(
      'search-dropdown'
    ) as HTMLAreaElement;
    var searchInputResponsive = document.getElementById(
      'search-options'
    ) as HTMLInputElement;
    dropdown.classList.remove('show');
    searchOptions.classList.add('d-none');
    searchInputResponsive.value = '';
  }

  // Remove Notification
  checkedValGet: any[] = [];
  onCheckboxChange(event: any, id: any) {
    var checkedVal: any[] = [];
    var result;
    for (var i = 0; i < this.notificationList.length; i++) {
      for (var x = 0; x < this.notificationList[i].items.length; x++) {
        if (this.notificationList[i].items[x].state == true) {
          result = this.notificationList[i].items[x].id;
          checkedVal.push(result);
        }
      }
    }
    this.checkedValGet = checkedVal;
    checkedVal.length > 0
      ? ((
          document.getElementById('notification-actions') as HTMLElement
        ).style.display = 'block')
      : ((
          document.getElementById('notification-actions') as HTMLElement
        ).style.display = 'none');
  }

  notificationDelete() {
    for (var i = 0; i < this.checkedValGet.length; i++) {
      for (var j = 0; j < this.notificationList.length; j++) {
        for (var x = 0; x < this.notificationList[j].items.length; x++) {
          if (this.notificationList[j].items[x].id == this.checkedValGet[i]) {
            this.notificationList[j].items.splice(x, 1);
          }
        }
      }
    }
    this.calculatenotification();
    this.removeNotificationModal?.hide();
  }

  calculatenotification() {
    this.totalNotify = 0;
    this.checkedValGet = [];
    this.notificationList.forEach((element: any) => {
      this.totalNotify += element.items.length;
      if (element.title == 'New') {
        this.newNotify = element.items.length;
      } else {
        this.readNotify = element.items.length;
      }
    });
    this.checkedValGet.length > 0
      ? ((
          document.getElementById('notification-actions') as HTMLElement
        ).style.display = 'block')
      : ((
          document.getElementById('notification-actions') as HTMLElement
        ).style.display = 'none');
    if (this.totalNotify == 0) {
      document
        .querySelector('.empty-notification-elem')
        ?.classList.remove('d-none');
    }
  }

  gotToProfile() {
    this.router.navigate(['/profile']);
  }

  gotToMessage() {
    this.router.navigate(['/test']);
  }

  /**
   * Logout the user
   */
  logout() {
    //this.authService.logout();

    // if (environment.defaultauth === 'firebase') {
    //   this.authService.logout();
    // } else {
    //   this.authFackservice.logout();
    // }
    this.tokenStorageService.signOut();
    this.router.navigate(['/auth/login']);
  }

  changeTheme(theme: string) {
    // Xóa tất cả các theme hiện tại
    document.documentElement.removeAttribute('data-theme');
    
    // Thêm theme mới
    if (theme !== 'default') {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Lưu theme vào localStorage để duy trì sau khi refresh
    localStorage.setItem('theme', theme);
}
}

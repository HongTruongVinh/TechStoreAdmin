import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ThousandSeparatorPipe } from '../../../pipeTransform/thousandSeparator.pipe';
import { DateToStringPipe } from '../../../pipeTransform/DatePipe';
//import * as L from "leaflet";
import { BreadcrumbsComponent } from '../../../shared/breadcrumbs/breadcrumbs.component';
import { OrderService } from '../../../core/services/order.service';
import { EPaymentMethod } from '../../../models/enum/etype_project.enum';
import { FullImageUrlPipe } from "../../../pipeTransform/full-image-url.pipe";
import { ProductService } from '../../../core/services/product.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerProductListItemModel } from '../../../models/models/product/customer-product-list-item.model';
import { OrderItemModel } from '../../../models/models/order-item/order-item.model';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { InStoreOrderCreateModel } from '../../../models/models/order/instore-order-create.model';
import { OrderItemCreateModel } from '../../../models/models/order-item/order-item-create.model';

@Component({
  selector: 'app-add-instore-order',
  standalone: true,
  imports: [
        ModalModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        BreadcrumbsComponent,
        ThousandSeparatorPipe,
        DateToStringPipe,
        FullImageUrlPipe
    ],
  templateUrl: './add-instore-order.component.html',
  styleUrl: './add-instore-order.component.scss'
})
export class AddInstoreOrderComponent {
breadCrumbItems!: Array<{}>;
  isLoading = false;

  invoiceAuthor: any;
  invoiceTime!: Date;
  newOrderForm!: UntypedFormGroup;

  allProducts: CustomerProductListItemModel[] = []; 
  displayedProducts: any;
  term: any;
  cartData!: OrderItemModel[];
  subtotal: any = 0;
  discount: any;
  discountRate = 0;
  shipping: any;
  shippingRate: any = '65.00';
  tax: any;
  taxRate = 0;
  totalprice: any;

  cashierId: string = '';
  cashierName: string = '';

  paymentMethods: { methodId: number, name: string }[] = [];
  paymentMethodNames: Record<EPaymentMethod, string> = {
  [EPaymentMethod.CreditCard]: 'Thẻ tín dụng',
  [EPaymentMethod.Momo]: 'Momo',
  [EPaymentMethod.PayPal]: 'PayPal',
  [EPaymentMethod.COD]: 'Thanh toán khi nhận hàng (COD)',
  [EPaymentMethod.Cash]: 'Tiền mặt'
};
  selectedpaymentMethodId: number = 0;

  @ViewChild('searchModal', { static: false }) searchModal!: ModalDirective;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private titleService: Title,
    private route: ActivatedRoute,
    private readonly tokenStorageService: TokenStorageService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService
  ) { }


  ngOnInit(): void {


    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Đơn hàng', active: true },
      { label: 'Tạo mới', active: true }
    ];

    this.newOrderForm = this.formBuilder.group({
          customerName: ['Hồng Trường Vinh', Validators.required],
          customerPhoneNumber: ['0399123123', Validators.required],
          customerEmail: ['vinh@gmail.com'],

        });

    this.paymentMethods = Object.values(EPaymentMethod)
      .filter(value => typeof value === 'number') // chỉ lấy các giá trị số
      .filter(value => value !== EPaymentMethod.COD) // loại bỏ COD khỏi danh sách dropdown
      .map(value => ({
        methodId: value as number,
        name: this.paymentMethodNames[value as EPaymentMethod]
      }));

    const user = this.tokenStorageService.getUser();
    if (user) {
      this.cashierId = user.userId;
      this.cashierName = user.lastName + " " + user.firstName;
    }

    this.loadData();

  }

  loadData() {
    this.isLoading = true;
    invoiceTime: Date.UTC(Date.now());
    this.cartData = [];

    this.productService.getCustomerProducts().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.allProducts = res.data;
          this.isLoading = false;
        } else {
          this.allProducts = [];
        }
      } else {
        this.isLoading = false;
      }
    })
    
  }

  saveAction(){

  }

  goToCheckout(){

    if (this.cartData.length == 0) {
      alert("Vui lòng chọn sản phẩm trước khi thanh toán");
      return;
    }

    if (this.newOrderForm.invalid) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng");
      return;
    }

    var instoreOrder: InStoreOrderCreateModel = {
      customerName: this.newOrderForm.value.customerName,
      customerPhonenumber: this.newOrderForm.value.customerPhoneNumber,
      paymentMethod: this.selectedpaymentMethodId,
      items: [],
    }

    for (const item of this.cartData) {
      const aItem: OrderItemCreateModel = {
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrderTime: item.priceAtOrderTime,
        totalPrice: item.totalPrice,
        discount: 0,
      };
      instoreOrder.items.push(aItem);
    }

    this.isLoading = true;

    this.orderService.createInStoreOrder(instoreOrder).subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.isLoading = false;
          const url = `manage-instore-orders/checkout/${res.data}`;
          window.open(url, '_blank');
        }
      }
      else {
        this.isLoading = false;
        alert("Có lỗi xảy ra trong quá trình tạo đơn hàng: " + res.systemMessage);
        return;
      }
    })
  }

  searchProduct() {
    if (this.term) {
      this.displayedProducts = this.allProducts.filter((el: any) => el.name.toLowerCase().includes(this.term.toLowerCase())).slice(0, 7);
      if( this.displayedProducts.length > 0) {
        this.searchModal.show();
      }
      else{
        this.searchModal.hide();
      }
    }
  }

  selectProduct(data: any) {

    if (this.cartData.some(item => item.productId === data.productId)) {
      this.searchModal.hide();
      this.term = '';
      return;
    }

    const orderItem: OrderItemModel = {
      productId: data.productId,
      categoryName: data.categoryName,
      productName: data.name,
      mainImageUrl: data.mainImageUrl,
      priceAtOrderTime: data.price,
      quantity: 1,
      totalPrice: (data.price * 1)
    }

    this.cartData.push(orderItem);
    this.searchModal.hide();

    this.term = '';
    this.calculateQty(1, 0, this.cartData.length -1)
  }

  removeOrderItem(productId: string) {
    const index = this.cartData.findIndex(item => item.productId === productId);

    if (index !== -1) {
      this.cartData.splice(index, 1);
      
      this.subtotal = 0;
      this.cartData.map((x: any) => {
        this.subtotal += parseFloat(x['totalPrice'])
      })
      this.subtotal = this.subtotal
      this.discount = (this.subtotal * this.discountRate)
      this.tax = (this.subtotal * this.taxRate);
      this.totalprice = (parseFloat(this.subtotal) - parseFloat(this.discount))
    }
  }

  // Increment Decrement Quantity
  qty: number = 0;
  calculateQty(id: any, qty: any, i: any) {
    this.subtotal = 0;
    if (id == '0' && qty > 1) {
      qty--;
      this.cartData[i].quantity = qty
      this.cartData[i].totalPrice = (this.cartData[i].quantity * this.cartData[i].priceAtOrderTime)
    }
    if (id == '1') {
      qty++;
      this.cartData[i].quantity = qty
      this.cartData[i].totalPrice = (this.cartData[i].quantity * this.cartData[i].priceAtOrderTime)
    }
    this.cartData.map((x: any) => {
      this.subtotal += parseFloat(x['totalPrice'])
    })
    this.subtotal = this.subtotal
    this.discount = (this.subtotal * this.discountRate)
    this.tax = (this.subtotal * this.taxRate);
    this.totalprice = (parseFloat(this.subtotal) - parseFloat(this.discount))
  }

  goToConfirmCheckout(){
    
  }
}

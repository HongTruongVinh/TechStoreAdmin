import { Component, ViewChild } from '@angular/core';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { InStoreOrderResponseModel } from '../../../models/models/order/instore-order-response.model';
import { FullImageUrlPipe } from "../../../pipeTransform/full-image-url.pipe";
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { Base64ImagePipe } from "../../../pipeTransform/base64Image.pipe";
import { PaymentService } from '../../../core/services/payment.service';
import { EOrderStatus, EPaymentMethod, EPaymentStatus } from '../../../models/enum/etype_project.enum';
import { FormsModule } from '@angular/forms';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { DateToStringPipe } from "../../../pipeTransform/DatePipe";
import { ThousandSeparatorPipe } from "../../../pipeTransform/thousandSeparator.pipe";

@Component({
  selector: 'app-checkout-instore-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbsComponent,
    ModalModule,
    FullImageUrlPipe,
    Base64ImagePipe,
    DateToStringPipe,
    ThousandSeparatorPipe
],
  templateUrl: './checkout-instore-order.component.html',
  styleUrl: './checkout-instore-order.component.scss'
})
export class CheckoutInstoreOrderComponent {
breadCrumbItems!: Array<{}>;
  isLoading = false;

  cashierName!: string;

  instoreOrder : InStoreOrderResponseModel = {
    orderId: '',
    customerName: '',
    customerPhonenumber: '',

    paymentStatus: EPaymentStatus.Pending,
    totalPrice: 0,
    discountAmount: 0,
    finalAmount: 0,

    invoiceId: '',
    status: EOrderStatus.Pending,

    paymentQRCode: '',
    paymentMethod: '',
    transactionCode: '',

    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentId: ''
  }

  isNotCashMethod = true;
  paymentStatus!: EPaymentStatus;
  isPaid = false;

  paymentMethods: { methodId: number, name: string }[] = [];
    paymentMethodNames: Record<EPaymentMethod, string> = {
    [EPaymentMethod.CreditCard]: 'Thẻ tín dụng',
    [EPaymentMethod.Momo]: 'Momo',
    [EPaymentMethod.PayPal]: 'PayPal',
    [EPaymentMethod.COD]: 'Thanh toán khi nhận hàng (COD)',
    [EPaymentMethod.Cash]: 'Tiền mặt'
  };
  selectedpaymentMethodId: number = 0;

  
    @ViewChild('confirmOrderModal', { static: false }) confirmOrderModal!: ModalDirective;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private readonly orderService: OrderService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly paymentService: PaymentService
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Đơn hàng', active: true },
      { label: 'Thanh toán', active: true }
    ];

    this.isLoading = true;

    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id')!;
      this.titleService.setTitle(`Đơn hàng #${orderId}`);
      this.loadOrderDetails(orderId);
    });

    

    this.paymentMethods = Object.keys(EPaymentMethod)
    .filter(key => !isNaN(Number(EPaymentMethod[key as any]))) // Lọc key là tên enum
    .map(key => {
      const methodId = EPaymentMethod[key as keyof typeof EPaymentMethod];
      return {
        methodId,
        name: this.paymentMethodNames[methodId]
      };
    })
    .filter(method => method.methodId !== EPaymentMethod.COD); // loại COD

    const user = this.tokenStorageService.getUser();
    if (user) {
      this.cashierName = user.lastName + " " + user.firstName;
    }


  }

  loadOrderDetails(orderId: string) {
    this.orderService.getInStoreOrder(orderId).subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.instoreOrder = res.data;
          this.paymentStatus = this.instoreOrder.paymentStatus;
          if(this.paymentStatus == EPaymentStatus.Paid){
            this.isPaid = true;
          }
          this.isLoading = false;
        } else {

        }
      } else {
        this.isLoading = false;
      }
    })
  }

  confirmOrder(){
    this.isLoading = true;
    this.orderService.confirmInStoreOrder(this.instoreOrder.orderId).subscribe((res) => {
      if (res.retCode == 0) {
        this.isLoading = false;
        this.isPaid = true;
        this.instoreOrder.paymentMethod = "Tiền mặt";
        this.confirmOrderModal.hide();
      } else {
        this.isLoading = false;
        
      }
    });
  }

  checkPayment(){
    this.isLoading = true;
    this.paymentService.getItem(this.instoreOrder.paymentId).subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.paymentStatus = res.data.paymentStatus;
          if(this.paymentStatus == EPaymentStatus.Paid){
            this.isPaid = true;
          }
          else{
            this.isPaid = false;
            this.showTemporarily();
          }
          this.isLoading = false;
        } else {

        }
      } else {
        this.isLoading = false;
      }
    })
  }

  onPaymentMethodChange(methodId: any) {
    const numericId = Number(methodId);

    const selectedMethod = this.paymentMethods.find(p => p.methodId === numericId);

    if (selectedMethod) {
      this.isNotCashMethod = selectedMethod.methodId !== EPaymentMethod.Cash;
    }
  }


  deleteOrder(){
    this.isLoading = true;
    this.orderService.deleteOrder(this.instoreOrder.orderId).subscribe((res) => {
      if (res.retCode == 0) {
        this.isLoading = false;
         window.close();
      } else {
        this.isLoading = false;
        // Handle error case
      }
    this.isLoading = false; 
    });
  }

  goToConfirmCheckout(){
    if(!this.isPaid){
      const url = `checkout/confirm/${this.instoreOrder.paymentId}`;
      window.open(url, '_blank');
    }
  }
  
  yetToPayImage = false;
  showTemporarily() {
    this.yetToPayImage = true; // Hiện thẻ
    setTimeout(() => {
      this.yetToPayImage = false; // Ẩn lại sau 2 giây
    }, 1000);
  }
}

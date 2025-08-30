import { Component } from '@angular/core';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { ModalModule } from 'ngx-bootstrap/modal';
import { InStoreOrderResponseModel } from '../../../models/models/order/instore-order-response.model';
import { FullImageUrlPipe } from "../../../pipeTransform/full-image-url.pipe";
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { Base64ImagePipe } from "../../../pipeTransform/base64Image.pipe";
import { PaymentService } from '../../../core/services/payment.service';
import { EPaymentMethod, EPaymentStatus } from '../../../models/enum/etype_project.enum';
import { FormsModule } from '@angular/forms';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { DateToStringPipe } from "../../../pipeTransform/DatePipe";
import { ThousandSeparatorPipe } from "../../../pipeTransform/thousandSeparator.pipe";

@Component({
  selector: 'app-checkout',
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
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  breadCrumbItems!: Array<{}>;
  isLoading = false;

  cashierName!: string;

  instoreOrder!: InStoreOrderResponseModel;

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

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private readonly orderService: OrderService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly paymentService: PaymentService
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Ecommerce', active: true },
      { label: 'Checkout', active: true }
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
    });
  }

  goToConfirmCheckout(){
    if(!this.isPaid){
      const url = `checkout/confirm/${this.instoreOrder.paymentId}`;
      window.open(url, '_blank');
    }
  }
}

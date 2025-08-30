import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment.service';
import { PaymentModel } from '../../../../models/models/payment/payment.model';
import { EPaymentStatus } from '../../../../models/enum/etype_project.enum';

@Component({
  selector: 'app-checkout-confirm',
  standalone: true,
  imports: [],
  templateUrl: './checkout-confirm.component.html',
  styleUrl: './checkout-confirm.component.scss'
})
export class CheckoutConfirmComponent {

  paymentId: string = '';
  payment!: PaymentModel;

  isPending = true;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private readonly paymentService: PaymentService
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.paymentId = params.get('paymentId')!;
      this.titleService.setTitle(`Hóa đơn #${this.paymentId}`);
      this.loadPaymentDetails(this.paymentId);
    });

  }

  loadPaymentDetails(paymentId: string) {
    this.paymentService.getItem(paymentId).subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.payment = res.data;
          if (this.payment.paymentStatus === EPaymentStatus.Paid) {
            this.isPending = false;
          }
        } else {

        }
      } else {
      }
    })
  }

  confirm() {
    this.paymentService.checkoutPayment(this.paymentId).subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.isPending = false;
        }
        window.close();
      } else {
        // Handle error
      }
    });
  }

  backToOrderDetail() {
    window.close();
  }

}

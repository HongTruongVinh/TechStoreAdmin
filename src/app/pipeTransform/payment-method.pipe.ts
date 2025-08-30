import { Pipe, PipeTransform } from '@angular/core';
import { EPaymentMethod } from '../models/enum/etype_project.enum';// đổi path nếu cần

@Pipe({
    name: 'paymentMethod',
    standalone: true,
})
export class EPaymentMethodPipe implements PipeTransform {

    transform(method: EPaymentMethod | null | undefined): string {
        switch (method) {
            case EPaymentMethod.CreditCard:
                return 'Thẻ tín dụng';
            case EPaymentMethod.Momo:
                return 'Ví Momo';
            case EPaymentMethod.PayPal:
                return 'PayPal';
            case EPaymentMethod.COD:
                return 'Khi nhận hàng';
            case EPaymentMethod.Cash:
                return 'Tiền mặt';
            default:
                return 'Không xác định';
        }
    }
}
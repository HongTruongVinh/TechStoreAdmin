import { Pipe, PipeTransform } from '@angular/core';
import { EInvoiceStatus } from '../models/enum/etype_project.enum';

@Pipe({
  name: 'invoiceStatus',
  standalone: true,
})
export class InvoiceStatusPipe implements PipeTransform {
  
  transform(status: EInvoiceStatus, type: 'label' | 'class' = 'label'): string {
    const statusMap: Record<EInvoiceStatus, { label: string,  class: string }> = {
      [EInvoiceStatus.Paid]:    { label: 'Đã thanh toán', class: 'text-success' },
      [EInvoiceStatus.Unpaid]: { label: 'Chưa thanh toán',     class: 'text-warning' },
      [EInvoiceStatus.Canceled]: { label: 'Đã hủy', class: 'text-danger' },
      [EInvoiceStatus.Refunded]:  { label: 'Đã hoàn tiền',  class: 'text-secondary' },
    };

    const result = statusMap[status] ?? { label: 'Không rõ', class: 'text-muted' };
    return type === 'label' ? result.label : result.class;
  }
}

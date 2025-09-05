import { Pipe, PipeTransform } from '@angular/core';
import { EOrderStatus, EUserStatus } from '../models/enum/etype_project.enum';// đổi path nếu cần

@Pipe({
  name: 'userStatus',
  standalone: true,
})
export class UserStatusPipe implements PipeTransform {
  
  transform(status: EUserStatus, type: 'label' | 'class' = 'label'): string {
    const statusMap: Record<EUserStatus, { label: string,  class: string }> = {
      [EUserStatus.Active]:    { label: 'Đang hoạt động', class: 'text-success' },
      [EUserStatus.Inactive]: { label: 'Không hoạt động',     class: 'text-warning' },
      [EUserStatus.Banned]: { label: 'Bị khóa', class: 'text-danger' },
      [EUserStatus.Deleted]:  { label: 'Đã xóa',  class: 'text-secondary' },
    };

    const result = statusMap[status] ?? { label: 'Không rõ', class: 'text-muted' };
    return type === 'label' ? result.label : result.class;
  }
}

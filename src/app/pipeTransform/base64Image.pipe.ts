import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64Image',
  standalone: true
})
export class Base64ImagePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    // Kiểm tra xem đã có prefix chưa
    if (value.startsWith('data:image')) return value;
    return `data:image/png;base64,${value}`;
  }
}

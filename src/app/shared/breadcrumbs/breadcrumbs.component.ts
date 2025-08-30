import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent {
  @Input() title: string | undefined;
  @Input()
  breadcrumbItems!: Array<{
    active?: boolean;
    label?: string;
    linkRouter?: string;
    isRouter?: boolean;
  }>;

  Item!: Array<{
    label?: string;
  }>;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  addDetailsForCourse() {
    var linkRouter = this.breadcrumbItems.find(x => x.isRouter == true);
    this.router.navigate([`${linkRouter?.linkRouter}`]);
  }
}

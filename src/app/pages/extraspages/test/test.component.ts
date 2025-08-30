import { Component } from '@angular/core';
import { BreadcrumbsComponent } from "../../../shared/breadcrumbs/breadcrumbs.component";
import { CommonModule } from '@angular/common';
import { CountUpComponent } from "../../charts/count-up/count-up.component";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [BreadcrumbsComponent, CommonModule, CountUpComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
// bread crumb items
    breadCrumbItems!: Array<{}>;
  
}

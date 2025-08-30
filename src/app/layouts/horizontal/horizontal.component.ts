import { Component } from '@angular/core';
import { TopbarComponent } from "../topbar/topbar.component";
import { HorizontalTopbarComponent } from "../horizontal-topbar/horizontal-topbar.component";
import { FooterComponent } from "../footer/footer.component";
import { RightsidebarComponent } from "../rightsidebar/rightsidebar.component";
import { RouterOutlet } from '@angular/router';
// Spinner
import { NgxSpinnerModule } from "ngx-spinner";

@Component({
  selector: 'app-horizontal',
  standalone: true,
  imports: [TopbarComponent, HorizontalTopbarComponent, FooterComponent, RightsidebarComponent, RouterOutlet, NgxSpinnerModule],
  templateUrl: './horizontal.component.html',
  styleUrl: './horizontal.component.scss'
})
export class HorizontalComponent {
  constructor() { }

  isCondensed = false;

  ngOnInit(): void {
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
    const rightBar = document.getElementById('theme-settings-offcanvas');
    if (rightBar != null) {
      rightBar.classList.toggle('show');
      rightBar.setAttribute('style', "visibility: visible;");
    }
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    if (document.documentElement.clientWidth <= 1024) {
      document.body.classList.toggle('menu');
    }
  }
}

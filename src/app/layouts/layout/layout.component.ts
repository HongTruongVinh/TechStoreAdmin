import { Component } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Language
import { LanguageService } from '../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// Offcanvas
// import { NgxAsideModule } from 'ngx-aside';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';

// Spinner
import { NgxSpinnerModule } from "ngx-spinner";


import { VerticalComponent } from '../vertical/vertical.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { RightsidebarComponent } from '../rightsidebar/rightsidebar.component';
import { TwoColumnComponent } from '../two-column/two-column.component';
import { TwoColumnSidebarComponent } from '../two-column-sidebar/two-column-sidebar.component';
import { HorizontalComponent } from '../horizontal/horizontal.component';
import { HorizontalTopbarComponent } from '../horizontal-topbar/horizontal-topbar.component';
import { LayoutState } from '../../store/layouts/layout-reducers';
import { EventService } from '../../core/services/event.service';
import { RootReducerState } from '../../store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HorizontalComponent, VerticalComponent, TwoColumnComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
// layout related config
layoutType!: string;
showMain: any;
initialAppState!: LayoutState;

constructor(private eventService: EventService, private store: Store<RootReducerState>) { }

ngOnInit() {
  this.store.select('layout').subscribe((data) => {
    this.layoutType = data.LAYOUT;
    document.documentElement.setAttribute('data-layout', data.LAYOUT);
    data.LAYOUT == "vertical" || data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar', data.SIDEBAR_COLOR) : '';
    data.LAYOUT == "vertical" ? document.documentElement.setAttribute('data-sidebar-size', data.SIDEBAR_SIZE) : '';
    document.documentElement.setAttribute('data-bs-theme', data.LAYOUT_MODE);
    document.documentElement.setAttribute('data-layout-width', data.LAYOUT_WIDTH);
    document.documentElement.setAttribute('data-sidebar-image', data.SIDEBAR_IMAGE);
    document.documentElement.setAttribute('data-layout-position', data.LAYOUT_POSITION);
    document.documentElement.setAttribute('data-layout-style', data.SIDEBAR_VIEW);
    document.documentElement.setAttribute('data-topbar', data.TOPBAR);
    document.documentElement.setAttribute('data-preloader', data.DATA_PRELOADER)
    document.documentElement.setAttribute('data-theme', data.LAYOUT_THEME)

    if (document.documentElement.getAttribute('data-preloader') == 'enable') {
      setTimeout(() => {
        (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
        (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
      }, 1000);
    }

  })
}

/**
/**
* Check if the vertical layout is requested
*/
isVerticalLayoutRequested() {
  return this.layoutType === 'vertical';
}

/**
 * Check if the horizontal layout is requested
 */
isHorizontalLayoutRequested() {
  return this.layoutType === 'horizontal';
}

/**
 * Check if the horizontal layout is requested
 */
isTwoColumnLayoutRequested() {
  return this.layoutType === 'twocolumn';
}

getLayoutRequest(): string {
  return this.layoutType
}
}

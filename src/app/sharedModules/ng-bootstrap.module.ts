import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { NgbAlertModule, NgbCollapseModule, NgbDropdownModule, NgbModalModule  } from '@ng-bootstrap/ng-bootstrap';
import {NgbAccordionModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbCollapseModule.forRoot(),
    NgbAlertModule.forRoot(),
    NgbDropdownModule.forRoot(),
    NgbModalModule.forRoot(),
    NgbAccordionModule.forRoot()
  ],
  exports: [
    NgbAlertModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbAccordionModule
  ],
  declarations: []
})
export class NgBootstrapModule {
}

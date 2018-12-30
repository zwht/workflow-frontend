import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseCorporationRoutingModule } from './base-corporation-routing.module';
import { GxListComponent } from './gx/list.component';
import { GxEditComponent } from './gx/edit/edit.component';

const COMPONENTS = [
  GxListComponent, GxEditComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    BaseCorporationRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BaseCorporationModule { }

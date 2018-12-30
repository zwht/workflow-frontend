import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseCorporationRoutingModule } from './base-corporation-routing.module';
import { GxListComponent } from './gx/list.component';
import { GxEditComponent } from './gx/edit/edit.component';
import { DoorEditComponent } from './door/edit/edit.component';
import { DoorListComponent } from './door/list.component';

const COMPONENTS = [
  GxListComponent, GxEditComponent,
  DoorEditComponent, DoorListComponent,

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

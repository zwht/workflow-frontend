import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseCorporationRoutingModule } from './base-corporation-routing.module';
import { GxListComponent } from './gx/list.component';
import { GxEditComponent } from './gx/edit/edit.component';
import { DoorEditComponent } from './door/edit/edit.component';
import { DoorListComponent } from './door/list.component';
import { SelectGxComponent } from './door/selectGx/selectGx.component';
import { ColorEditComponent } from './color/edit/edit.component';
import { ColorListComponent } from './color/list.component';
import { MaterialEditComponent } from './material/edit/edit.component';
import { MaterialListComponent } from './material/list.component';

const COMPONENTS = [
  GxListComponent, GxEditComponent,
  DoorEditComponent, DoorListComponent,
  ColorEditComponent, ColorListComponent,
  MaterialEditComponent, MaterialListComponent,
];
const COMPONENTS_NOROUNT = [ SelectGxComponent];

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

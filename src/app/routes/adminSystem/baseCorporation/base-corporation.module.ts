/*
 * @Descripttion: 
 * @version: 
 * @Author: zhaowei
 * @Date: 2019-04-24 15:35:22
 * @LastEditors: zhaowei
 * @LastEditTime: 2019-11-14 16:23:42
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseCorporationRoutingModule } from './base-corporation-routing.module';
import { GxListComponent } from './gx/list.component';
import { GxEditComponent } from './gx/edit/edit.component';
import { DoorEditComponent } from './door/edit/edit.component';
import { DoorListComponent } from './door/list.component';
import { SelectGxComponent } from './selectGx/selectGx.component';
import { ColorEditComponent } from './color/edit/edit.component';
import { ColorListComponent } from './color/list.component';
import { MaterialEditComponent } from './material/edit/edit.component';
import { MaterialListComponent } from './material/list.component';
import { BrandListComponent } from './brand/list.component';
import { BrandEditComponent } from './brand/edit/edit.component';

const COMPONENTS = [
  GxListComponent, GxEditComponent,
  DoorEditComponent, DoorListComponent,
  ColorEditComponent, ColorListComponent,
  MaterialEditComponent, MaterialListComponent,
  BrandEditComponent, BrandListComponent,
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

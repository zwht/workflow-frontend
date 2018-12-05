import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TestRoutingModule } from './test-routing.module';
import { TestListComponent } from './list/list.component';
import { TestListEditComponent } from './list/edit/edit.component';
import { TestListEdit1Component } from './list/edit1/edit1.component';

const COMPONENTS = [
  TestListComponent,
  TestListEdit1Component];
const COMPONENTS_NOROUNT = [
  TestListEditComponent];

@NgModule({
  imports: [
    SharedModule,
    TestRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TestModule { }

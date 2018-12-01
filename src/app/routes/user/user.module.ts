import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserIndexComponent } from './index/index.component';
import { UserIndexDetailComponent } from './index/detail/detail.component';
const COMPONENTS = [UserIndexComponent];
const COMPONENTS_NOROUNT = [
  UserIndexDetailComponent];

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class UserModule { }

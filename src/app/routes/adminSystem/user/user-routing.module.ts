import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserIndexComponent } from './index/index.component';
import { UserIndexEditComponent } from './index/edit/edit.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [
  {
    path: 'index', component: UserIndexComponent,
    data: { title: '用户列表', reuse: true }
  },
  {
    path: 'edit', component: UserIndexEditComponent,
    data: { title: '编辑用户', reuse: false }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

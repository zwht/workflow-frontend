import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserIndexComponent } from './index/index.component';

const routes: Routes = [
  { path: 'index', component: UserIndexComponent, data: { title: '用户列表', reuse: true } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

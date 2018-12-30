import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import { GxListComponent } from './gx/list.component';
import { GxEditComponent } from './gx/edit/edit.component';

const routes: Routes = [
  {
    path: 'gx', component: GxListComponent,
    canActivate: [ACLGuard], data: { guard: ['100'], title: '工序列表', reuse: true }
  },
  {
    path: 'gx/edit', component: GxEditComponent,
    canActivate: [ACLGuard], data: { guard: ['100'], title: '编辑工序', reuse: true }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseCorporationRoutingModule { }

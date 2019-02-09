import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import { GxListComponent } from './gx/list.component';
import { GxEditComponent } from './gx/edit/edit.component';
import { DoorEditComponent } from './door/edit/edit.component';
import { DoorListComponent } from './door/list.component';
import { ColorListComponent } from './color/list.component';
import { ColorEditComponent } from './color/edit/edit.component';
import { MaterialListComponent } from './material/list.component';
import { MaterialEditComponent } from './material/edit/edit.component';

const routes: Routes = [
  {
    path: 'door', component: DoorListComponent,
    canActivate: [ACLGuard], data: { guard: ['100'], title: '产品列表', reuse: true }
  },
  {
    path: 'door/edit', component: DoorEditComponent,
    canActivate: [ACLGuard], data: { guard: ['100'], title: '产品', reuse: true }
  },
  {
    path: 'gx', component: GxListComponent,
    canActivate: [ACLGuard], data: { guard: ['100'], title: '工序列表', reuse: true }
  },
  {
    path: 'gx/edit', component: GxEditComponent,
    canActivate: [ACLGuard], data: { guard: ['100'], title: '创建/编辑工序', reuse: true }
  },
  {
    path: 'color', component: ColorListComponent,
    canActivate: [ACLGuard], data: { guard: ['100'], title: '颜色列表', reuse: true }
  },
  {
    path: 'color/edit', component: ColorEditComponent,
    canActivate: [ACLGuard], data: { guard: ['100'], title: '创建/编辑颜色', reuse: true }
  },
  {
    path: 'material', component: MaterialListComponent,
    canActivate: [ACLGuard], data: { guard: ['100'], title: '材质列表', reuse: true }
  },
  {
    path: 'material/edit', component: MaterialEditComponent,
    canActivate: [ACLGuard], data: { guard: ['100'], title: '创建/编辑材质', reuse: true }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseCorporationRoutingModule { }

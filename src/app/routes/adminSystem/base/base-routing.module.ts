import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeComponent } from './code/code.component';
import { CodeEditComponent } from './code/edit/edit.component';
import { IconComponent } from './icon/icon.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [
  {
    path: 'code', component: CodeComponent,
    canActivate: [ACLGuard], data: { guard: '0', title: '码表列表', reuse: true }
  },
  {
    path: 'code/edit', component: CodeEditComponent,
    canActivate: [ACLGuard], data: { guard: '0', title: '编辑码表', reuse: true }
  },
  { path: 'icon', component: IconComponent, data: { title: 'icon图标', reuse: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }

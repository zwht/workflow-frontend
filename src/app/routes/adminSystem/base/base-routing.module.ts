import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeComponent } from './code/code.component';
import { CodeEditComponent } from './code/edit/edit.component';
import { CodeGroupComponent } from './codeGroup/code.component';
import { CodeGroupEditComponent } from './codeGroup/edit/edit.component';
import { IconComponent } from './icon/icon.component';
import { ACLGuard } from '@delon/acl';
import { CorporationComponent } from './corporation/corporation.component';
import { CorporationEditComponent } from './corporation/edit/edit.component';

const routes: Routes = [
  {
    path: 'corporation', component: CorporationComponent,
    canActivate: [ACLGuard], data: { guard: [888888], title: '公司列表', reuse: true }
  },
  {
    path: 'corporation/edit', component: CorporationEditComponent,
    canActivate: [ACLGuard], data: { guard: [888888], title: '编辑公司', reuse: true }
  },
  {
    path: 'code', component: CodeComponent,
    canActivate: [ACLGuard], data: { guard: [888888], title: '码表列表', reuse: true }
  },
  {
    path: 'code/edit', component: CodeEditComponent,
    canActivate: [ACLGuard], data: { guard: [888888], title: '编辑码表', reuse: true }
  },
  {
    path: 'codeGroup', component: CodeGroupComponent,
    canActivate: [ACLGuard], data: { guard: [888888], title: '码表组列表', reuse: true }
  },
  {
    path: 'codeGroup/edit', component: CodeGroupEditComponent,
    canActivate: [ACLGuard], data: { guard: [888888], title: '编辑码表组', reuse: true }
  },
  {
    path: 'icon', component: IconComponent,
    canActivate: [ACLGuard], data: { guard: [888888], title: 'icon图标', reuse: true }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeComponent } from './code/code.component';
import { CodeEditComponent } from './code/edit/edit.component';

const routes: Routes = [
  { path: 'code', component: CodeComponent, data: { title: '码表列表', reuse: true } },
  { path: 'code/edit', component: CodeEditComponent, data: { title: '编辑码表', reuse: false } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }

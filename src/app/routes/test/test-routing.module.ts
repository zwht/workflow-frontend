import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestListComponent } from './list/list.component';
import { TestListEdit1Component } from './list/edit1/edit1.component';

const routes: Routes = [

  { path: 'list', component: TestListComponent },
  { path: 'edit1', component: TestListEdit1Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }

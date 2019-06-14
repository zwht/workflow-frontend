import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import { MyTicketEditComponent } from './myTicket/edit/edit.component';
import { MyTicketListComponent } from './myTicket/list.component';

const routes: Routes = [
  {
    path: 'myTicket',
    component: MyTicketListComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品列表', reuse: true },
  },
  {
    path: 'shTicket',
    component: MyTicketListComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品列表', reuse: true },
  },
  {
    path: 'dscTicket',
    component: MyTicketListComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品列表', reuse: true },
  },
  {
    path: 'overTicket',
    component: MyTicketListComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品列表', reuse: true },
  },
  {
    path: 'scTicket',
    component: MyTicketListComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品列表', reuse: true },
  },
  {
    path: 'scwcTicket',
    component: MyTicketListComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品列表', reuse: true },
  },
  {
    path: 'fhTicket',
    component: MyTicketListComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品列表', reuse: true },
  },
  {
    path: 'myTicket/edit',
    component: MyTicketEditComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品', reuse: true },
  },
  {
    path: 'shTicket/edit',
    component: MyTicketEditComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品', reuse: true },
  },
  {
    path: 'dscTicket/edit',
    component: MyTicketEditComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品', reuse: true },
  },
  {
    path: 'overTicket/edit',
    component: MyTicketEditComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品', reuse: true },
  },
  {
    path: 'scTicket/edit',
    component: MyTicketEditComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品', reuse: true },
  },
  {
    path: 'scwcTicket/edit',
    component: MyTicketEditComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品', reuse: true },
  },
  {
    path: 'fhTicket/edit',
    component: MyTicketEditComponent,
    canActivate: [ACLGuard],
    data: { guard: ['100'], title: '产品', reuse: true },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketRoutingModule {}

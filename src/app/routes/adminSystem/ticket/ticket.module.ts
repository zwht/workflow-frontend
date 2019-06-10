import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { TicketRoutingModule } from './ticket-routing.module';
import { MyTicketEditComponent } from './myTicket/edit/edit.component';
import { MyTicketListComponent } from './myTicket/list.component';
import { SelectDoorComponent } from './myTicket/selectDoor/selectDoor.component';
import { SelectColorComponent } from './myTicket/selectColor/selectColor.component';
import { PopParamsComponent } from './myTicket/popParams/popParams.component';
import { SelectMaterialComponent } from './myTicket/selectMaterial/selectMaterial.component';


const COMPONENTS = [
  MyTicketListComponent, MyTicketEditComponent,
];
const COMPONENTS_NOROUNT = [PopParamsComponent,SelectDoorComponent, SelectColorComponent, SelectMaterialComponent];

@NgModule({
  imports: [
    SharedModule,
    TicketRoutingModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TicketModule { }

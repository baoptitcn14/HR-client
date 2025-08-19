import { NgModule } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ValidatorsService } from './validators.service';
import { UtilitiesService } from './utilities.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    // import service của các libs bên ngoài
    DialogService,
    ValidatorsService,
    UtilitiesService,
  ]
})
export class LibServiceModule { }

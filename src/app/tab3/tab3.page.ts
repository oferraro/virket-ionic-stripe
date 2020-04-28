import { Component } from '@angular/core';
import {MercadopagoService} from "../services/mercadopago.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  constructor(
    public mercadopagoService: MercadopagoService,
  ) {}

}

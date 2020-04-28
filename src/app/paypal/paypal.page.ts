import { Component, OnInit } from '@angular/core';
import {MercadopagoService} from "../services/mercadopago.service";

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.page.html',
  styleUrls: ['./paypal.page.scss'],
})
export class PaypalPage implements OnInit {

  constructor(
      public mercadopagoService: MercadopagoService,
  ) { }

  oxxoPay() {
    this.mercadopagoService.oxxoPay();
  }

  ngOnInit() {
  }

}

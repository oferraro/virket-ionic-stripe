import { Component } from '@angular/core';
import {UserService} from "../services/user.service";
import {MercadopagoService} from "../services/mercadopago.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public step = 0;

  constructor(
      public userService: UserService,
      public mercadopagoService: MercadopagoService,
  ) { }

  restartProcess() {
    this.step = 0;
  }

  stripeStepOne() {
    this.step = -1; // Remove all the buttons using the steps
    this.mercadopagoService.findCustomer().subscribe((res: any) => {
      if (res.cards.default_card) {
        res.cards.cards.forEach((card) => {
          if (card.id === res.cards.default_card) {
            this.mercadopagoService.customer.card = card;
          }
        });
        this.step = 1; // Has default card (show form and create card token)
      } else {
        this.step = 2; // Has no default card, go to add card form
      }
      // MPDataDefault
    });
  }

  stripeStepTwo() {
    // this.intent.client_secret
  }

}

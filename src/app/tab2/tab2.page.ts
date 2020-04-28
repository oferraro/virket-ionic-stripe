import { Component } from '@angular/core';
import {UserService} from "../services/user.service";
import {API_URL, STRIPE_PUBLIC_KEY} from "../constants";
import {HttpClient} from "@angular/common/http";
import {Stripe} from "@ionic-native/stripe/ngx";

interface MPCustomer {
  email: string;
  card?: any;
}

interface Cart {
  price: number;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public step = 0;
  public cart: Cart = {price: 8000};
  public intent: any = {};
  public customer: MPCustomer = {email: "os@oferraro.com", card: 'no_card'}
  constructor(
      public userService: UserService,
      public httpClient: HttpClient,
      private stripe: Stripe,
  ) {
    // this.userService.getUsers();
    this.stripe.setPublishableKey(STRIPE_PUBLIC_KEY);
  }

  restartProcess() {
    this.step = 0;
  }

  stripeStepOne() {
    this.step = -1; // Remove all the buttons using the steps
    this.httpClient.post(API_URL + 'api/mercadopago/customer/search',{
      cart: this.cart,
      customer: this.customer
    }).subscribe((res: any) => {
          console.log('res', res);
          console.log('res cards', res.cards.cards);
          console.log('res default card', res.cards.default_card);
          if (res.cards.default_card) {
            this.step = 1; // Has default card (show form and create card token)
            res.cards.cards.forEach((card) => {
              if (card.id === res.cards.default_card) {
                this.customer.card = card;
              }
            });
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

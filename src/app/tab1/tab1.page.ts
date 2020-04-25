import { Component } from '@angular/core';
import { Stripe } from '@ionic-native/stripe/ngx';
import {HttpClient} from "@angular/common/http";

// TODO: replace this with the proper ip
const API_URL = 'http://192.168.0.13:8000/';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
      private stripe: Stripe,
      public httpClient: HttpClient,
  ) {
    const stripePublicKey = 'pk_test_ytza3isIkOiAcCXUKHokrpbY00IQ15FCMp';
    this.stripe.setPublishableKey(stripePublicKey);
  }

  stripePay() {
    let card = {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2020,
      cvc: '220'
    }

    this.stripe.createCardToken(card)
        .then(token => {
          this.doPayment(token.id);
        })
        .catch(error => {
          console.error(error);
        });
  }

  doPayment(tokenID) {
    this.httpClient.post(API_URL + 'api/stripe/step1',{cardToken: tokenID})
        .subscribe(res => {
            console.log('res', res);
      });
  }

}

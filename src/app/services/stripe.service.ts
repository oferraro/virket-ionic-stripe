import { Injectable } from '@angular/core';
import {API_URL, STRIPE_PUBLIC_KEY} from "../constants";
import {Stripe} from "@ionic-native/stripe/ngx";
import {HttpClient} from "@angular/common/http";

export interface CreditCard {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  public creditCard: CreditCard;
  public paymentStep: number;
  public intentSecret: string;
  constructor(
      private stripe: Stripe,
      public httpClient: HttpClient,
  ) {
    this.stripe.setPublishableKey(STRIPE_PUBLIC_KEY);
    this.paymentStep = 1;
    const d = new Date();
    this.creditCard = {
      number: '4242424242424242', expMonth: 12, expYear: d.getFullYear(),
      cvc: '1234'
    };
  }

  updateUserCard() {
    this.stripe.createCardToken(this.creditCard)
        .then(token => {
          this.doPayment(token);
        })
        .catch(error => {
          console.error(error);
        });
  }

  doPayment(token) {
    this.paymentStep = 2;
    this.httpClient.post(API_URL + 'api/stripe/step1',{cardToken: token})
      .subscribe((res: any) => {
        console.log('res', res);
        this.intentSecret = res.intent.client_secret;
    });
  }

  confirmPayment() {
    this.httpClient.post(API_URL + 'api/stripe/step2',{intentSecret: this.intentSecret})
      .subscribe((res: any) => {

    });
  }

  cancelPayment() {
    this.paymentStep = 1;
  }

}

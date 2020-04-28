import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL} from "../constants";
export const CONSTANTS = {
  API_URL: 'http://192.168.0.13:8000/api/',
  MP_LIBRARY: 'https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js',
  MP_TOKEN: 'TEST-98bc38c3-36d4-4f26-b0e4-8c3fe23a83f8',
  MP_FORM: 'https://www.mercadopago.com.ar/integrations/v1/web-tokenize-checkout.js'
};

export interface MPData {
  email: string;
  name: string;
  cartAmount: number;
  cardNumber: string;
  cardSecurityCode: number;
  expirationMonth: number;
  expirationYear: number;
  documentNumber: string;
  documentType: string;
}

export interface MercadoPagoCardTokenCodeError {
  code: string,
  description: string,
}

export interface MercadoPagoCardTokenError {
  hasError: boolean,
  error: string,
  message: string,
  causes: MercadoPagoCardTokenCodeError[],
}

export const MPDataDefault = {email: 'test@oferraro.com', name: 'Oscar', cartAmount: 1200,
  cardNumber: '5031755734530604', cardSecurityCode: 123, expirationMonth: 11, expirationYear: 25,
  documentNumber: '12345678', documentType: ''
};

export interface MPCustomer {
  email: string;
  card?: any;
}

export interface Cart {
  price: number;
}

declare var window;

@Injectable({
  providedIn: 'root'
})
export class MercadopagoService {
  public loading = false;
  public MercadopagoCallbackId = '';
  public mercadoPagoResponse: any = {};
  public cart: Cart = {price: 8000};
  public intent: any = {};
  public customer: MPCustomer = {email: "os@oferraro.com", card: 'no_card'}
  public mpCreateTokenErrors: MercadoPagoCardTokenError = {
    hasError: false,
    error: '',
    message: '',
    causes: [],
  };
  public mpData: MPData = MPDataDefault;
  constructor(
      public httpClient: HttpClient
  ) {
    if (typeof window.mercadopago === 'undefined') {
      this.loadMercadoPago();
    }
  }

  public hasStatus() {
    return (
        this.mercadoPagoResponse &&
        typeof this.mercadoPagoResponse.status !== 'undefined' &&
        this.mercadoPagoResponse.status.trim() !== ''
    );
  }

  mercadoPagoStartAgain() {
    this.loading = true;
    this.MercadopagoCallbackId = '';
    window.MercadoPago = undefined;
    this.loadMercadoPago();
    // this.setMercadopagoConfiguration();
  }

  public loadMercadoPago() {
    this.loading = true;
    this.loadScript(CONSTANTS.MP_LIBRARY, [], () => {
      if (typeof window.Mercadopago !== 'undefined') {
        this.setMercadopagoConfiguration();
      } else {
        setTimeout(() => {
          this.setMercadopagoConfiguration();
        }, 1000); // try in 1 second
      }
    });
  }

  doCheckout() {
    const docTypeElement = document.getElementById('docType') as HTMLSelectElement;
    this.mpData.documentType = docTypeElement.value;
    const form = document.getElementById('checkout-form');
    this.mpCreateTokenErrors.hasError = false;
    window.Mercadopago.createToken(form, (params, res) => {
      if (res.id) {
        this.MercadopagoCallbackId = res.id;
      }
      this.mpCreateTokenErrors = {
        error: res.error, message: res.message, causes: res.cause,
        hasError: (res.error)
      }
      this.mercadoPagoResponse = {
        status: res.status
      };
    });
  }

  payInBackend(MercadopagoPaymentId) {
    this.loading = true;
    const formData = {...this.mpData};
    console.log('formdata', formData);
    formData.cardNumber = '';
    this.httpClient.post(CONSTANTS.API_URL + 'mercadopago/pay', {
      MercadopagoPaymentId, formData
    }).subscribe((res: any) => {
      console.log('payment response: ', res);
      this.mercadoPagoResponse.status = res.status;
      this.mercadoPagoStartAgain();
    });
  }

  public loadScript(script: string, extraAttrs, onLoadCallback?) {
    const mercadoPagoScriptElement = document.createElement( 'script' );
    mercadoPagoScriptElement.src = script;
    extraAttrs.forEach((attribute) => {
      mercadoPagoScriptElement.setAttribute(attribute.key, attribute.value);
    });
    document.body.appendChild(mercadoPagoScriptElement);
    if (typeof onLoadCallback === 'function') {
      mercadoPagoScriptElement.addEventListener('load', onLoadCallback());
    }
  }

  setMercadopagoConfiguration() {
    window.Mercadopago.setPublishableKey(CONSTANTS.MP_TOKEN);
    const documentTypes = document.getElementById('docType') as HTMLSelectElement;
    if (documentTypes && documentTypes.options.length === 0) {
      this.checkDocumentTypes();
      window.Mercadopago.getIdentificationTypes();
    } else {
      setTimeout(() => {
        this.setMercadopagoConfiguration();
      }, 1000); // try in 1 second
    }
  }

  checkDocumentTypes() {
    const documentTypes = document.getElementById('docType') as HTMLSelectElement;
    if (documentTypes.options.length === 0) { // Did load but document types selector are still empty
      setTimeout(() => {
        this.checkDocumentTypes();
      }, 1000); // try in 1 second
    } else {
      this.loading = false;
    }
  }

  cardInfo() { // TODO: remove this, not in use
    window.Mercadopago.getPaymentMethod({"payment_method_id": "visa"}, (res, data) => {
      console.log('here', data, data[0].id); // TODO: Check why this is an array
      window.Mercadopago.getIssuers(data[0].id, (issuerData, issuerRes) => { // Issuer are the banks which issued this card
        console.log('issuerData: ', issuerData, issuerRes);

        console.log('bin', data);
        /*window.Mercadopago.getInstallments({"bin": data[0].settings[0].bin, "amount": this.cartAmount},
            (installmentsCode, installmentsRes) => {
              console.log('installmentsCode, installmentsRes', installmentsCode, installmentsRes);
            });*/
      });
    });
  }

  findCustomer() {
    return this.httpClient.post(API_URL + 'api/mercadopago/customer/search',{
      cart: this.cart,
      customer: this.customer
    });
  }

  stepThree() {
    const form = {
      // customer.card
    };
    window.Mercadopago.createToken(form, (params, res) => {
      this.mpData.documentType = 'DNI';
      this.mpData.email = this.customer.email;
      this.mpData.name = this.customer.card.cardholder.name;
      this.mpData.expirationMonth = this.customer.card.expiration_month;
      this.mpData.expirationYear = this.customer.card.expiration_year;
      this.payInBackend(res.id);
    });
  }
}

import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CONSTANTS} from "../services/mercadopago.service";

interface ResponsePaging {
  total: number,
  limit: number,
  offset: number
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public payments: any = [];
  public loading = false;
  public responsePaging: ResponsePaging = {total: 0, limit: 0, offset: 0};
  constructor(
      public httpClient: HttpClient
  ) {
    this.getPayments();
  }

  getPayments() {
    this.loading = true;
    this.httpClient.post(CONSTANTS.API_URL + 'mercadopago/payments/get', {
    }).subscribe((res: any) => {
      console.log('payments response: ', res);
      this.responsePaging = res.payments.paging;
      this.payments = res.payments.results;
      this.loading = false;
    });
  }

}

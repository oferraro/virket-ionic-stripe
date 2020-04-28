import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL, usersList} from "../constants";

export interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public users: User[] = usersList;
  public currentUser: User;
  constructor(
      public httpClient: HttpClient,
  ) {
    this.currentUser = this.users[1];
  }

  getCurrentUser() {
    console.log(this.currentUser);
  }

  setCurrentUser(event) {
    this.users.forEach((user: User) => {
      if (user.id === event.target.value) {
        this.currentUser = user;
      }
    });
    console.log('current user', this.currentUser);
  }
}

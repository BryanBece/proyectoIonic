import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;

  constructor() { }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  clearCurrentUser() {
    this.currentUser = null;
  }
}
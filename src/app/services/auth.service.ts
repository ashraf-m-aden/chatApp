import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token = localStorage.getItem('token');
  private _options = {
    url: "http://localhost:3000",
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Width': 'XMLHttpRequest',
      Authorization: this.token,
    })
  };
  constructor(private http: HttpClient
  ) { }

  logIn(email, password) {
    return this.http.post('http://localhost:3000/users/login', { email, password });
  }
  signUp(email, name, Lname, password) {
    return this.http.post('http://localhost:3000/users', { email, name, Lname, password });
  }
  logOut() {
    return this.http.post('http://localhost:3000/users/logout', null, this._options);
  }
}

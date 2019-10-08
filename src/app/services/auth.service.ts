import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  prod = 'https://chatappbackendnodejs.herokuapp.com/';
  dev = 'http://localhost:3000/';
  token = localStorage.getItem('token');
  _options;
  Authentication: Subject<boolean> = new Subject<boolean>();
  Auth = this.Authentication.asObservable();
  constructor(private http: HttpClient,
    private router: Router
  ) { }

  Headers() {
    this._options = {
      url: this.dev,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-Width': 'XMLHttpRequest',
        'Authorization': localStorage.getItem('token'),
      })
    };
  }
  logIn(email, password) {
    return this.http.post(this.dev + 'users/login', { email, password }).subscribe(
      (data: any) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.user._id);
        this.Authentication.next(true);
        this.router.navigate(['/messages/0']);

      }, (error) => {
        return error;
      }
    );
  }
  signUp(email, name, Lname, password) {
    return this.http.post(this.dev + 'users', { email, name, Lname, password }).subscribe(
      (user: any) => {
        console.log(user);
        localStorage.setItem('id', user.user._id);
        localStorage.setItem('token', user.token);
        this.Authentication.next(true);
        this.router.navigate(['/messages/0']);

      },
      (error) => {
        console.log(error);

      }
    );
  }
  logOut() {
    this.Headers();
    return this.http.post(this.dev + 'users/logout', null, this._options);
  }
  getUser() {
    this.Headers();
    return this.http.get(this.dev + 'users/me', this._options);

  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  token = localStorage.getItem('token');
  private _options = {
    url: "http://localhost:3000",
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Width': 'XMLHttpRequest',
      Authorization: this.token,
    })
  };
  constructor(
    private http: HttpClient
  ) { }

  searchFriend(username) {
  return  this.http.post("localhost:3000/users/friend", username, this._options);
  }
}

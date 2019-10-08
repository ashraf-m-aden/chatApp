import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  prod = "https://chatappbackendnodejs.herokuapp.com/";
  dev = "http://localhost:3000/";
  _options;
  constructor(
    private http: HttpClient
  ) { }
  Headers() {
    this._options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-Width': 'XMLHttpRequest',
        'Authorization': localStorage.getItem('token'),
      })
    };
  }
  searchFriend(username) {
    this.Headers();
    return this.http.post(this.dev + "users/friend", { username }, this._options);
  }
  getFriendProfile(id) {
    return this.http.get(this.dev + 'users/' + id);
  }
  sendFriendRequest(id) {
    this.Headers();
    return this.http.patch(this.dev + "users/friendRequest", { id }, this._options);
  }
  getFriendRequest() {
    this.Headers();
    return this.http.get(this.dev + "users/request", this._options);
  }
  getFriends() {
    this.Headers();
    return this.http.get(this.dev + "users/allFriends", this._options);
  }
  answerRequest(answer, id) {
    this.Headers();
    return this.http.patch(this.dev + "users/answerRequest", { answer, id }, this._options);
  }
}

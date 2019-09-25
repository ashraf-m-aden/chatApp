import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConnService {

  private socket = io('http://localhost:3000');
  constructor() { }

  joinRoom(username, room) {
    const observable = new Observable<any>(observer => {
      this.socket.emit('join', { username, room }, (data) => {
        observer.next(data);
      });
    });
    return observable;

  }

  sendMessage(data) {
    this.socket.emit('message', data, () => {
      console.log("message delivered");

    });
  }
  sendLocation(data) {
    this.socket.emit('sendLocation', data);

  }
  newUsersInRoom() {
    const observable = new Observable<any>(observer => {
      this.socket.on('roomData', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
  newMessageReceived() {
    const observable = new Observable<any>(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  newBroadcastReceived() {
    const observable = new Observable<any>(observer => {
      this.socket.on('broadcast', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  typing(data) {
    this.socket.emit('typing', data);
  }

  receivedTyping() {
    const observable = new Observable<{ isTyping: boolean }>(observer => {
      this.socket.on('typing', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }


}

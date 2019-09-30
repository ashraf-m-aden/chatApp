import { AuthService } from './../services/auth.service';
import { ConnService } from '../services/conn.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxAutoScroll } from "ngx-auto-scroll";
import { ThrowStmt } from '@angular/compiler';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild(NgxAutoScroll, { static: false }) ngxAutoScroll: NgxAutoScroll;
  message: String;
  messageArray: Array<{ username: String, time: String, message: String }> = [];
  usersInRoom = [];
  private isTyping = false;
  form: FormGroup;
  userName;
  room;
  isAuth = new Observable();
  isConnected = false;
  container = document.getElementById("messages");
  constructor(
    private webSocketService: ConnService,
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) {
    this.isAuth.subscribe(
      (data) => {
        console.log(data);

      }
    );
    if (localStorage.getItem('id') && localStorage.getItem('token')) {
      this.isConnected = true;
    }
    this.webSocketService.newMessageReceived().subscribe((data) => {
      this.messageArray.push({
        username: data.username,
        time: data.time,
        message: data.message
      });
      this.isTyping = false;
    });
    this.webSocketService.newBroadcastReceived().subscribe((data) => {
      this.messageArray.push({
        username: data.username,
        time: data.time,
        message: data.message
      });
    });
    this.webSocketService.newUsersInRoom().subscribe((data) => {
      this.usersInRoom = data.users;
      this.room = data.room;

    });
    this.webSocketService.receivedTyping().subscribe(bool => {
      this.isTyping = bool.isTyping;
    });

  }
  initform() {
    this.form = this.formBuilder.group({
      input: ''
    });
  }
  public forceScrollDown(): void {
    this.ngxAutoScroll.forceScrollDown();
  }

  ngOnInit() {
    this.initform();
  }
  // autoScroll() {
  //   // new message element
  //   const $newMessage = <HTMLElement>document.getElementById("child").lastElementChild;

  //   // height of the new message
  //   const $newMessageStyle = getComputedStyle($newMessage);
  //   const $newMessageMargin = parseInt($newMessageStyle.marginBottom);
  //   const $newMessageHeight = $newMessage.offsetHeight + $newMessageMargin;

  //   // visible height
  //   const visibleHeight = this.container.offsetHeight;

  //   // height of messages container
  //   const containerHeight = this.container.scrollHeight;

  //   // how far have i scrolled
  //   const scrollOffset = this.container.scrollTop + visibleHeight;

  //   if (containerHeight - $newMessageHeight <= scrollOffset) {
  //     this.container.scrollTop = this.container.scrollHeight;
  //   }
  // }


  sendLocation() {
    if ('geolocation' in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition((position) => {
        this.webSocketService.sendLocation({ lat: position.coords.latitude, long: position.coords.longitude });
      });
    } else {
      /* geolocation IS NOT available */
    }
  }
  sendMessage() {
    if (this.form.get('input').value.length > 0) {
      this.webSocketService.sendMessage(this.form.get('input').value);
      this.form.get('input').setValue('');
    } else {
      document.getElementById("envoyer").style.backgroundColor = "red"
      setTimeout(() => {
        document.getElementById("envoyer").style.backgroundColor = "#7C5CBF"

      }, 2000);
    }


  }
  goToChat(x) {
    this.router.navigate(['/messages/1']);

  }

  typing() {
    //   this.webSocketService.typing({room: this.chatroom, user: this.userService.getLoggedInUser().username});
  }
  logOut() {
    this.auth.logOut().subscribe(
      () => {
        localStorage.clear();
        this.router.navigate(['/join']);

      },
      (error) => {
        console.log(error);
      }
    );
  }
}

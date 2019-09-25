import { ConnService } from './../services/conn.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxAutoScroll } from "ngx-auto-scroll";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(NgxAutoScroll, { static: false }) ngxAutoScroll: NgxAutoScroll;
  message: String;
  messageArray: Array<{ username: String, time: String, message: String }> = [];
  usersInRoom = [];
  private isTyping = false;
  form: FormGroup;
  userName;
  room;
  container = document.getElementById("messages");
  constructor(
    private route: ActivatedRoute,
    private webSocketService: ConnService,
    private router: Router,
    private formBuilder: FormBuilder,
    private aR: ActivatedRoute
  ) {
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

    this.userName = this.aR.snapshot.params['name'];
    this.room = this.aR.snapshot.params['room'];

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

  typing() {
    //   this.webSocketService.typing({room: this.chatroom, user: this.userService.getLoggedInUser().username});
  }

}

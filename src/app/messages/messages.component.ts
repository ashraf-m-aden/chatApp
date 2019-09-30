import { FriendsService } from './../services/friends.service';
import { ConnService } from './../services/conn.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxAutoScroll } from "ngx-auto-scroll";
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @ViewChild(NgxAutoScroll, { static: false }) ngxAutoScroll: NgxAutoScroll;
  error; //message d'erreur
  isRoom = false;
  message: String;
  messageArray: Array<{ username: String, time: String, message: String }> = [];
  usersInRoom = [];
  private isTyping = false;
  form: FormGroup;
  friend: FormGroup;
  userName;
  room;
  container = document.getElementById("messages");
  constructor(
    private webSocketService: ConnService,
    private formBuilder: FormBuilder,
    private aR: ActivatedRoute,
    private friends: FriendsService,
    private router: Router
  ) {
    if (!localStorage.getItem('id') && !localStorage.getItem('token')) {
      router.navigate(['/join']);
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
    this.friend = this.formBuilder.group({
      friend: ''
    });
  }
  public forceScrollDown(): void {
    this.ngxAutoScroll.forceScrollDown();
  }

  ngOnInit() {
    this.initform();
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
  searchFriend() {
    console.log(this.friend.get('friend').value);

    this.friends.searchFriend(this.friend.get('friend').value).subscribe(
      (users) => {
        console.log(users);

      },
      (error) => {
        this.error = error.error;
        console.log(error);

      }
    );
  }

}

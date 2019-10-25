import { FriendsService } from './../services/friends.service';
import { ConnService } from './../services/conn.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxAutoScroll } from "ngx-auto-scroll";
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @ViewChild(NgxAutoScroll, { static: false }) ngxAutoScroll: NgxAutoScroll;
  error; //message d'erreur
  myUserData;
  isRoom = false; // dit si on est dans un chat ou pas
  message: String;
  messageArray: Array<{ username: String, time: String, message: String }> = [];
  usersInRoom = [];
  private isTyping = false;
  form: FormGroup;
  friend: FormGroup;
  userName;
  room;
  container = document.getElementById("messages");
  searchResults = [];
  constructor(
    private webSocketService: ConnService,
    private formBuilder: FormBuilder,
    private aR: ActivatedRoute,
    private friends: FriendsService,
    private router: Router,
    private auth: AuthService
  ) {
    if (!localStorage.getItem('id') && !localStorage.getItem('token')) {
      router.navigate(['/join']);
    }
    setTimeout(() => {
      this.auth.getUser().subscribe((user) => {
        this.myUserData = user;
      });
    }, 3000);
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
    this.searchResults = [];
    this.error = false;
    if (this.friend.get('friend').value && this.friend.get('friend').value.length >= 3) {
      this.friends.searchFriend(this.friend.get('friend').value).subscribe(
        (users: any) => {
          if (users.error) {
            this.error = users.error;
            this.searchResults = [];
          } else {
            console.log(users);
            this.error = false;
            users.forEach((user) => {
              if (user._id !== this.myUserData._id) {
                this.searchResults.push(
                  {
                    id: user._id,
                    name: user.name,
                    Lname: user.Lname,
                    avatar: user.avatar
                  });
              }
            });
          }
        });
    }
  }

  goMessage(id) {
    this.router.navigate(['/profile', { id }]);
  }
}

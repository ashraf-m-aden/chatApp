import { FriendsService } from './../services/friends.service';
import { AuthService } from './../services/auth.service';
import { ConnService } from '../services/conn.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxAutoScroll } from "ngx-auto-scroll";

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
  notifCount = 0;
  room;
  myUser;
  friendRequest = [];
  myFriends = [];
  isConnected = false;
  container = document.getElementById("messages");
  constructor(
    private webSocketService: ConnService,
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private friend: FriendsService
  ) {
    this.auth.Auth.subscribe(
      (data) => {
        this.isConnected = data;
      }
    );
    if (localStorage.getItem('id') && localStorage.getItem('token')) {
      this.isConnected = true;
      this.auth.getUser().subscribe((user) => {
        this.myUser = user;
        this.countNotif();
      });
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
  countNotif() {
    this.friend.getFriendRequest().subscribe((users: any) => {
      users.forEach((user) => {
        if (user.status === 'pending') {
          this.friend.getFriendProfile(user._id).subscribe((_user) => {
            this.friendRequest.push(_user);
            this.notifCount = this.friendRequest.length;

          });
        }
      });
    });
  }

  accept(id) {
    this.friend.answerRequest('yes', id).subscribe(() => {
      this.countNotif();
    });
  }
  reject(id) {
    this.friend.answerRequest('no', id).subscribe(() => {
      this.countNotif();

    });
  }
  ngOnInit() {
    this.initform();
  }

  getAllFriend() {
    this.myFriends = [];
    this.friend.getFriends().subscribe((users: any) => {
      users.forEach((user) => {
        this.friend.getFriendProfile(user._id).subscribe((friend) => {
          this.myFriends.push(friend);
        });
      });
    });
  }
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
  Menus() {
    if (localStorage.getItem('id')) {
      this.router.navigate(['/messages/0']);
    } else {
      this.router.navigate(['/join']);

    }
  }
  logOut() {
    this.auth.logOut().subscribe(
      () => {
        localStorage.clear();
        this.isConnected = false;
        this.router.navigate(['/join']);

      },
      (error) => {
        console.log(error);
      }
    );
  }

  async joinRoom(id, name) {
    this.webSocketService.joinRoom(this.myUser._id, id)
      .subscribe((resp: any) => {
        if (resp.error) {
          alert(resp.error);
        } else {
          this.router.navigate(['/message/' + name]);

        }
      });
  }
}

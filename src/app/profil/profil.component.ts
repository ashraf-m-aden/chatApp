import { FriendsService } from './../services/friends.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user; //this user
  users; // all my friends
  isFriend = false;
  pending = false;

  constructor(
    private ar: ActivatedRoute,
    private friend: FriendsService) {
    this.ar.params.subscribe((id) => {
      this.friend.getFriendProfile(id.id).subscribe((user) => {
        this.user = user;
      });
    });
    this.friend.getFriends().subscribe((users) => {
      this.users = users;
      const mfriend = this.users.find((user) => {
        return this.user._id = user._id;
      });
      if (mfriend !== undefined) {
        if (mfriend.status === 'pending') {
          this.pending = true;
        } else {
          this.isFriend = true;
        }
      } else {
        this.isFriend = false;
      }
    },
      (error) => {
        console.log(error);

      });
  }

  ngOnInit() {
  }

  sendFriendRequest(id) {
    this.friend.sendFriendRequest(id).subscribe(
      () => {
        console.log('pending...');
        this.pending = true;

      },
      (error) => {
        console.log(error);

      }
    );
  }
  deleteFriend(id) {
    this.friend.deleteFriend(id).subscribe(
      () => {
        this.isFriend = false;
      });
  }
}

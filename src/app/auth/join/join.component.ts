import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConnService } from '../../services/conn.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  join: FormGroup
  error;
  isAuth = new Subject();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private webSocketService: ConnService,
    private auth: AuthService

  ) {
    if (localStorage.getItem('id') && localStorage.getItem('token')) {
      router.navigate(['/messages/0']);
    }
  }

  ngOnInit() {
    this.join = this.formBuilder.group({
      email: '',
      mdp: ''
    });
  }
  async joinRoom() {
    this.webSocketService.joinRoom(this.join.get('name').value, this.join.get('room').value)
      .subscribe((resp: any) => {
        if (resp.error) {
          alert(resp.error);
        } else {
          this.router.navigate(['/home', { name: this.join.get('name').value, room: this.join.get('room').value }]);

        }
      });
  }

  logIn() {
    this.auth.logIn(this.join.get('email').value, this.join.get('mdp').value).subscribe(
      (data: any) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.user._id);
        this.isAuth.next(true);
        this.router.navigate(['/messages/0']);

      }, (error) => {
        this.error = error.error;
      }
    );
  }
}

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

  logIn() {
    this.auth.logIn(this.join.get('email').value, this.join.get('mdp').value);
  }
}

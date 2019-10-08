import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUp: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router) {
      if (localStorage.getItem('id') && localStorage.getItem('token')) {
        router.navigate(['/messages/0']);
      }
     }

  ngOnInit() {
    this.signUp = this.formBuilder.group({
      email: '',
      name: '',
      Lname: '',
      mdp: '',
      mdpC: ''
    });
  }

  signUpUser() {
    const email = this.signUp.get('email').value;
    const name = this.signUp.get('name').value;
    const Lname = this.signUp.get('Lname').value;
    const mdp = this.signUp.get('mdp').value;
    const mdpC = this.signUp.get('mdpC').value;
    //
    if (mdp === mdpC) {
      this.auth.signUp(email, name, Lname, mdp);
    }
  }

}

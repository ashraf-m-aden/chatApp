import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConnService } from '../services/conn.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  join: FormGroup
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private webSocketService: ConnService,

  ) { }

  ngOnInit() {
    this.join = this.formBuilder.group({
      name: '',
      room: ''
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
}

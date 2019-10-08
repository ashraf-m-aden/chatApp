import { MessagesComponent } from './messages/messages.component';
import { JoinComponent } from './auth/join/join.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HeaderComponent } from './header/header.component';
import { ProfilComponent } from './profil/profil.component';


const routes: Routes = [
  { path: '', component: JoinComponent },

  { path: 'messages/:id', component: MessagesComponent },
  { path: 'profile', component: ProfilComponent },

  { path: 'join', component: JoinComponent },
  { path: 'signUp', component: SignUpComponent }

];

export const COMPONENTS = [
  HeaderComponent, JoinComponent, SignUpComponent, MessagesComponent, ProfilComponent
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

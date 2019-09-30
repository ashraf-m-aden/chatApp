import { AuthService } from './services/auth.service';
import { ConnService } from './services/conn.service';
import { JoinComponent } from './auth/join/join.component';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxAutoScrollModule } from "ngx-auto-scroll";

import { AppRoutingModule, COMPONENTS } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    COMPONENTS
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxAutoScrollModule
  ],
  providers: [
    ConnService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import {NgOptimizedImage} from "@angular/common";
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { TeamsComponent } from './components/teams/teams.component';
import { FaqComponent } from './components/faq/faq.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AngularFireModule} from "@angular/fire/compat";
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LogoutComponent } from './components/logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    LeaderboardComponent,
    TeamsComponent,
    FaqComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAnxKbz3xat7JeeErTx1XT2FLzPoTOageI",
      authDomain: "pokecore-89a25.firebaseapp.com",
      projectId: "pokecore-89a25",
      storageBucket: "pokecore-89a25.appspot.com",
      messagingSenderId: "866622716320",
      appId: "1:866622716320:web:5a875b8d50e30fdd2fccc5"
    }),
    AngularFireModule,
    provideFirebaseApp(() => initializeApp({
      "projectId": "pokecore-89a25",
      "appId": "1:866622716320:web:5a875b8d50e30fdd2fccc5",
      "storageBucket": "pokecore-89a25.appspot.com",
      "apiKey": "AIzaSyAnxKbz3xat7JeeErTx1XT2FLzPoTOageI",
      "authDomain": "pokecore-89a25.firebaseapp.com",
      "messagingSenderId": "866622716320"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp({"projectId":"pokecore-89a25","appId":"1:866622716320:web:5a875b8d50e30fdd2fccc5","storageBucket":"pokecore-89a25.appspot.com","apiKey":"AIzaSyAnxKbz3xat7JeeErTx1XT2FLzPoTOageI","authDomain":"pokecore-89a25.firebaseapp.com","messagingSenderId":"866622716320"}))
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;

  constructor(
    private auth: Auth,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,

  ) {
    this.afAuth.authState.pipe(map(user => !!user)).subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  // Funcion para hacer Register
  async register({email, password}: any) {
    const result = await createUserWithEmailAndPassword(this.auth, email, password);
    return await this.afs.collection('Userdata').doc(result.user.uid).set({
      email: email,
      favorites: [] // Inicia el array de favoritos para poder actualizarlo con los pokemons fav
    }, {merge: true});
  }

  //funcion login
  async login({email, password}: any) {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.emitLoginEvent();
      }
    });
  }

  //funcion logout
  async logout() {
    await signOut(this.auth);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.emitLogoutEvent();
      }
    });
  }

  private emitLoginEvent() {
    location.reload();
  }

  private emitLogoutEvent() {
    location.reload();
  }

}

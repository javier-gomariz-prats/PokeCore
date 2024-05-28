import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  //hace la funcion de logout
  onClick() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['pokecore/homepage']);
        console.log('LogOut hecho')
      })
      .catch(error => console.log(error));
  }

}

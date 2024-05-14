import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  formLogin: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.authService.login(this.formLogin.value)
      .then(response => {
        console.log(response);
        this.router.navigate(['pokecore/homepage'])
      })
      .catch(error => console.log(error));
  }
}

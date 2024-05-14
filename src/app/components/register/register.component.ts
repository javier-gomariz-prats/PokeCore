import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { UserdataServicesService } from "../../services/userdata-services.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formReg: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userDataService: UserdataServicesService
  ) {
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    })
  }

  async onSubmit() {
    const { password, ...userData } = this.formReg.value; // Pasa el UserName y el Correo al userData
    this.authService.register({ email: userData.email, password }) // Manda Solo el Correo y Password a Auth
      .then(response => {
        console.log(response);
        this.router.navigate(['pokecore/login'])
      }).catch(error => console.log(error));
    console.log(userData);
    const response = await this.userDataService.addUserData(userData); // Pasa correo y name al Servicio
    console.log(response);
  }

  ngOnInit(): void {
  }
}

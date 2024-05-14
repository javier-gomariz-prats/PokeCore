import { NgModule } from '@angular/core';
import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import {HomepageComponent} from "./components/homepage/homepage.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {LeaderboardComponent} from "./components/leaderboard/leaderboard.component";
import {TeamsComponent} from "./components/teams/teams.component";
import {FaqComponent} from "./components/faq/faq.component";
import {canActivate, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {LogoutComponent} from "./components/logout/logout.component";

const routes: Routes = [
  {
    path:'',
    redirectTo:'pokecore/homepage',
    pathMatch: 'full'
  },
  {
    path:'pokecore/homepage',
    component:HomepageComponent
  },
  {
    path:'pokecore/register',
    component:RegisterComponent
  },
  {
    path:'pokecore/login',
    component:LoginComponent
  },{
    path:'pokecore/rankings',
    component:LeaderboardComponent,
    ...canActivate(()=>redirectUnauthorizedTo(['pokecore/login']))
  },{
    path:'pokecore/teams',
    component:TeamsComponent,
    ...canActivate(()=>redirectUnauthorizedTo(['pokecore/login']))
  },{
    path:'pokecore/faq',
    component:FaqComponent,
  },{
    path:'pokecore/logout',
    component:LogoutComponent,
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

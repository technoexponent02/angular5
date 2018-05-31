import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/auth/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (this.authenticationService.isLoggedIn()) {
    //   // logged in so return true
    //   return true;
    // }
    if (this.authenticationService.whoLoggedIn() == 2) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect
    this.router.navigate(['/']);
    return false;
  }
}

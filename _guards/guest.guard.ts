import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/auth/authentication.service';

@Injectable()
export class GuestGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authenticationService.isLoggedIn()) {
      return true;
    }


    // authenticated so redirect
    this.router.navigate(['/user/dashboard']);
    return false;
  }
}

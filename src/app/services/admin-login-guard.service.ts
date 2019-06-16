import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginGuardService implements CanActivate {

  constructor(
    private router: Router,
    private adminService: AdminService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.adminService.state.loggedIn) {
      return new Promise(resolve => {
        this.adminService.status()
          .subscribe(
            res => {
              if (!res.auth) {
                resolve(true);
              } else {
                // Navigate to the Admin page
                this.router.navigate(['/admin']);

                resolve(false);
              }
            },
            err => {
              resolve(true);
            }
          );
      });
    } else {
      // Navigate to the Admin page
      this.router.navigate(['/admin']);

      return false;
    }
  }
}

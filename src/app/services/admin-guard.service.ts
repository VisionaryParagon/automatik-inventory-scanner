import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(
    private router: Router,
    private adminService: AdminService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    return new Promise(resolve => {
      this.adminService.status()
        .subscribe(
          res => {
            if (res.auth) {
              resolve(true);
            } else {
              // Save redirect URL
              this.adminService.returnUrl = state.url;

              // Navigate to the login page
              this.router.navigate(['/admin/login']);

              resolve(false);
            }
          },
          err => {
            // Navigate to the login page
            this.router.navigate(['/admin/login']);

            resolve(false);
          }
        );
    });
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AdminService } from './admin.service';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      this.adminService.status()
        .then((res) => {
          if (res.auth) {
            resolve(true);
          } else {
            // Save redirect URL
            this.adminService.returnUrl = state.url;

            // Navigate to the login page
            this.router.navigate(['/admin/login']);
            resolve(false);
          }
        })
        .catch(() => {
          // Navigate to the login page
          this.router.navigate(['/admin/login']);
          resolve(false);
        });
    });
  }
}

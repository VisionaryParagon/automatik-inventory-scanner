import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';

import { Admin } from '../../services/classes';
import { AdminService } from '../../services/admin.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class AdminLoginComponent implements OnInit {
  returnUrl: string;
  admin: Admin = new Admin();
  adminCookie = this.cookieService.get('adminId');
  loading = false;
  invalid = false;
  error = false;
  err: string;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    if (this.adminCookie) {
      this.router.navigate(['/admin']);
    }

    // Get return url from route parameters or default to Home
    this.returnUrl = this.adminService.returnUrl || '/admin';
  }

  login(user, form) {
    form.submitted = true;

    if (form.valid) {
      this.loading = true;

      this.adminService.login(user)
        .then((res) => {
          if (res.message === 'Login successful!') {
            this.hideError(form);
            this.loading = false;

            // Set cookie
            this.cookieService.put('adminId', 'verified');

            // Save login status
            this.adminService.loggedIn = true;

            // Redirect to saved URL or home
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.invalid = true;
            this.err = res.message;
          }
        })
        .catch((res) => {
          if (res.name === 'IncorrectUsernameError') {
            form.controls['username'].setErrors({ invalidUsername: true });
          } else if (res.name === 'IncorrectPasswordError') {
            form.controls['password'].setErrors({ invalidPassword: true });
          } else {
            this.showError();
          }
          this.loading = false;
        });
    }
    return false;
  }

  cancel() {
    this.router.navigate(['/']);
  }

  showError() {
    this.error = true;
  }

  hideError(form) {
    this.invalid = false;
    this.error = false;
    this.err = '';
  }
}

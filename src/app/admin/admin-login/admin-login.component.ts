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
  invalid = false;
  invalidUsername = false;
  invalidPassword = false;
  error = false;
  err = {};
  submitted = false;

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

  login(user, isValid) {
    this.submitted = true;

    if (isValid) {
      this.adminService.login(user)
        .then((res) => {
          if (res.message === 'Login successful!') {
            this.hideError();

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
            this.invalidUsername = true;
            this.invalid = true;
            this.err = 'Invalid username';
          } else if (res.name === 'IncorrectPasswordError') {
            this.invalidPassword = true;
            this.invalid = true;
            this.err = 'Invalid password';
          } else {
            this.showError();
          }
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

  hideError() {
    this.invalid = false;
    this.invalidUsername = false;
    this.invalidPassword = false;
    this.error = false;
  }
}

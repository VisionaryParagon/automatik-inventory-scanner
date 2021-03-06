import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';

import { CookieService } from 'ngx-cookie';

import { AdminService } from './services/admin.service';

import { NavAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ NavAnimation ]
})
export class AppComponent implements OnInit {
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  isLoggedIn = false;
  isLoggedInAdmin = false;
  isAdmin = false;
  notHome = false;
  state = 'inactive';
  subState = 'inactive';

  constructor(
    private router: Router,
    private location: Location,
    private cookieService: CookieService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });

    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationStart) {
        // save page scroll location
        if (ev.url !== this.lastPoppedUrl) {
          this.yScrollStack.push(window.scrollY);
        }
      } else if (ev instanceof NavigationEnd) {
        // set page scroll
        if (ev.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else {
          window.scrollTo(0, 0);
        }

        // check user status
        this.isLoggedInAdmin = this.adminService.state.loggedIn;

        // route checks for nav
        if (ev.url === ('/' || '/admin')) {
          this.notHome = false;
        } else {
          this.notHome = true;
        }

        if (ev.url.indexOf('/admin') === 0) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
    });

    this.setNavHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setNavHeight();
  }

  setNavHeight() {
    document.getElementById('navMenu').style.maxHeight = (window.outerHeight - 50) + 'px';
  }

  toggleNav() {
    this.state = (this.state === 'active' ? 'inactive' : 'active');

    if (document.body.className.indexOf('modal') === -1) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  closeNav() {
    this.state = 'inactive';
    document.body.classList.remove('modal-open');
  }

  outsideNav() {
    if (this.state === 'active') {
      this.state = 'inactive';
      document.body.classList.remove('modal-open');
    }
  }

  toggleSubNav() {
    this.subState = (this.subState === 'active' ? 'inactive' : 'active');
  }

  closeSubNav() {
    this.subState = 'inactive';
  }

  refresh() {
    if (this.router.url === '/') {
      window.location.reload();
    }
  }

  logoutAdmin() {
    this.adminService.logout()
      .subscribe(
        res => {
          // Delete cookies
          this.cookieService.removeAll();

          // Remove admin login status
          this.adminService.state.loggedIn = false;

          // Redirect to login page
          this.router.navigate(['/admin/login']);
        },
        err => console.log(err)
      );
  }

}

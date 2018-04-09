import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CookieService } from 'ngx-cookie';

import { User } from '../../services/classes';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

import { AdminFormComponent } from '../admin-form/admin-form.component';
import { AdminDeleteComponent } from '../admin-delete/admin-delete.component';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class AdminHomeComponent implements OnInit {
  users = [];
  filteredUsers = [];
  user: User;
  filter = '';
  modalOptions = {
    maxWidth: '768px'
  };
  loading = true;
  error = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private cookieService: CookieService,
    private userService: UserService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers()
      .then(res => {
        this.users = res;
        this.filteredUsers = [...res];
        this.loading = false;
      })
      .catch(() => {
        this.error = true;
      });
  }

  resetUsers() {
    this.filter = '';
    this.getUsers();
    this.userService.clearCurrentUser();
  }

  newUser() {
    this.user = new User();
    this.userService.setCurrentUser(this.user);

    const dialogRef = this.dialog.open(AdminFormComponent, this.modalOptions);

    dialogRef.afterClosed().subscribe(() => {
      this.resetUsers();
    });
  }

  editUser(id) {
    this.user = this.users.filter(user => user._id === id)[0];
    this.userService.setCurrentUser(this.user);

    const dialogRef = this.dialog.open(AdminFormComponent, this.modalOptions);

    dialogRef.afterClosed().subscribe(() => {
      this.resetUsers();
    });
  }

  deleteUser(id) {
    this.user = this.users.filter(user => user._id === id)[0];
    this.userService.setCurrentUser(this.user);

    const dialogRef = this.dialog.open(AdminDeleteComponent, this.modalOptions);

    dialogRef.afterClosed().subscribe(() => {
      this.resetUsers();
    });
  }

  updateFilter() {
    const val = this.filter.toLowerCase();

    const filtered = this.filteredUsers.filter(d => {
      return  d.first_name.toLowerCase().indexOf(val) !== -1 ||
              d.last_name.toLowerCase().indexOf(val) !== -1 ||
              d.phone.toLowerCase().indexOf(val) !== -1 ||
              d.email.toLowerCase().indexOf(val) !== -1;
    });

    this.users = filtered;
  }

  clearFilter() {
    this.filter = '';
    this.getUsers();
  }

  logout() {
    this.adminService.loggedIn = false;
    this.cookieService.removeAll();
    this.adminService.logout();

    this.router.navigate(['/admin/login']);
  }
}

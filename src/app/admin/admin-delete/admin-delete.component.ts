import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { User } from '../../services/classes';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-delete',
  templateUrl: './admin-delete.component.html',
  styleUrls: ['./admin-delete.component.css']
})
export class AdminDeleteComponent implements OnInit {
  user: User;
  success = false;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<AdminDeleteComponent>,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    // console.log(this.user);
  }

  deleteUser() {
    this.userService.deleteUser(this.user)
      .then(() => {
        this.success = true;
      })
      .catch(() => {
        this.showError();
      });
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.error = false;
  }
}

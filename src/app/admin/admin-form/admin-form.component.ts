import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { User } from '../../services/classes';
import { UserService } from '../../services/user.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class AdminFormComponent implements OnInit {
  user: User;
  edit = false;
  submitted = false;
  success = false;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<AdminFormComponent>,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    // console.log(this.user);

    if (this.user._id) {
      this.edit = true;
    }
  }

  saveUser(isValid) {
    this.submitted = true;

    if (isValid) {
      /*
      if (!this.user.image) {
        this.user.image = '/assets/images/no-image.jpg';
      }
      */

      if (!this.edit) {
        this.userService.createUser(this.user)
          .then(() => {
            this.success = true;
            this.submitted = false;
          })
          .catch(() => {
            this.showError();
            this.submitted = false;
          });
      } else {
        this.userService.updateUser(this.user)
          .then(() => {
            this.success = true;
            this.submitted = false;
          })
          .catch(() => {
            this.showError();
            this.submitted = false;
          });
      }
    }
    return false;
  }

  addAnother() {
    this.user = new User();
    this.success = false;
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.error = false;
  }
}

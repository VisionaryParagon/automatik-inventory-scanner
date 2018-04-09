import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { User } from './classes';

@Injectable()
export class UserService {
  private userUrl = '/usr/users';
  currentUser: User = new User();

  constructor(
    private http: Http
  ) { }

  // get all users
  getUsers() {
    return this.http.get(this.userUrl)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // get one user
  getUser(user) {
    const idUrl = this.userUrl + '/' + user;
    return this.http.get(idUrl)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // set current user
  setCurrentUser(user) {
    this.currentUser = user;
  }

  // get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // clear current user
  clearCurrentUser() {
    this.currentUser = new User();
  }

  // create new user
  createUser(user) {
    return this.http.post(this.userUrl, user)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // delete user
  deleteUser(user) {
    const idUrl = this.userUrl + '/' + user._id;
    return this.http.delete(idUrl)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // update user
  updateUser(user) {
    const idUrl = this.userUrl + '/' + user._id;
    return this.http.put(idUrl, user)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body;
  }

  private handleError (error: any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject('An error occurred');
  }
}

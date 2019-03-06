import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  adminUrlRoot = '/admn/';
  returnUrl: string;
  state = {
    loggedIn: false,
    permissions: ''
  };

  constructor(
    private http: HttpClient
  ) { }

  // get loggedIn status
  getLoginStatus() {
    return this.state;
  }

  // set loggedIn status
  setLoginStatus(state) {
    this.state.loggedIn = state.auth;
    this.state.permissions = state.permissions;
  }

  // login
  login(user) {
    return this.http.post<any>(this.adminUrlRoot + 'login', user)
      .pipe(
        tap(res => this.setLoginStatus({ auth: true, permissions: res.permissions })),
        catchError(this.handleError)
      );
  }

  // logout
  logout() {
    return this.http.get<any>(this.adminUrlRoot + 'logout')
      .pipe(
        tap(res => this.setLoginStatus({ auth: false, permissions: '' })),
        catchError(this.handleError)
      );
  }

  // get status
  status() {
    return this.http.get<any>(this.adminUrlRoot + 'status')
      .pipe(
        retry(3),
        tap(res => this.setLoginStatus(res)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }
}

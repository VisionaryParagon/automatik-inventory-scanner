import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AdminService {
  returnUrl: string;
  loggedIn = false;

  constructor(
    private http: Http
  ) { }

  // login
  login(user) {
    return this.http.post('/admn/login', user)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // logout
  logout() {
    return this.http.get('/admn/logout')
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // get status
  status() {
    return this.http.get('/admn/status')
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || { };
  }

  private handleError (error: any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      errMsg = body;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
}

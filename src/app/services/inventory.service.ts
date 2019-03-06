import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { Item } from './classes';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private inventoryUrl = '/inv/items';
  currentItem: Item = new Item();

  constructor(
    private http: HttpClient
  ) { }

  // set current item
  setCurrentItem(item) {
    this.currentItem = item;
  }

  // get current item
  getCurrentItem() {
    return this.currentItem;
  }

  // clear current item
  clearCurrentItem() {
    this.currentItem = new Item();
  }

  // get all items
  getItems() {
    return this.http.get<Item[]>(this.inventoryUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get one item by id
  getItem(item) {
    const idUrl = this.inventoryUrl + '/' + item;
    return this.http.get<Item>(idUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // create new item
  createItem(item) {
    return this.http.post<Item>(this.inventoryUrl, item)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // delete item
  deleteItem(item) {
    const idUrl = this.inventoryUrl + '/' + item._id;
    return this.http.delete<any>(idUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // update item
  updateItem(item) {
    const idUrl = this.inventoryUrl + '/' + item._id;
    return this.http.put<Item>(idUrl, item)
      .pipe(
        retry(3),
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

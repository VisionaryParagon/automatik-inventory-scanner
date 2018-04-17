import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Item } from './classes';

@Injectable()
export class InventoryService {
  private inventoryUrl = '/inv/items';
  currentItem: Item = new Item();

  constructor(
    private http: Http
  ) { }

  // get all items
  getItems() {
    return this.http.get(this.inventoryUrl)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // get one item by id
  getItem(item) {
    const idUrl = this.inventoryUrl + '/' + item;
    return this.http.get(idUrl)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

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

  // create new item
  createItem(item) {
    return this.http.post(this.inventoryUrl, item)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // delete item
  deleteItem(item) {
    const idUrl = this.inventoryUrl + '/' + item._id;
    return this.http.delete(idUrl)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  // update item
  updateItem(item) {
    const idUrl = this.inventoryUrl + '/' + item._id;
    return this.http.put(idUrl, item)
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

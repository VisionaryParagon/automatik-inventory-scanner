import { Injectable } from '@angular/core';

@Injectable()
export class SortService {

  constructor() { }

  sort(array: Array<any>, args: Array<any>): Array<any> {
    args.reverse().forEach(arg => {
      array.sort((a, b) => {
        if (a[arg] === b[arg]) {
          return 0;
        }
        if (a[arg] == null) {
          return 1;
        }
        if (b[arg] == null) {
          return -1;
        }
        return a[arg] > b[arg] ? 1 : -1;
      });
    });
    return array;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor() { }

  autoMap(obj1: any, obj2: any) {
    if (obj1 && obj2) {
      for (var property in obj2) {
        if (obj1.hasOwnProperty(property))
          (<any>obj1)[property] = (<any>obj2)[property];
      }
    }
    return obj1;
  }
}

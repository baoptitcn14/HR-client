import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  customId(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const array = new Uint8Array(length);

    crypto.getRandomValues(array); // Tạo mảng ngẫu nhiên an toàn

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    return result;
  }
}

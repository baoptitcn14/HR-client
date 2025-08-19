import { inject, Injectable } from '@angular/core';
import { SettingInfoServiceProxy } from '../service-proxies/sys-service-proxies';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  setting = inject(SettingInfoServiceProxy)

  init() {
    return new Promise<void>((resolve, reject) => {
     
    })
  }
}

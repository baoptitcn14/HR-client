import { Injectable } from '@angular/core';
import { CategoryOutputDto } from '../../shared/service-proxies/sys-service-proxies';

@Injectable({
    providedIn: 'root'
})

export class StoreSerivce {
    KHUVUCS: CategoryOutputDto[] = [];
    KYNANGS: CategoryOutputDto[] = [];
    HINHTHUCLAMVIECS: CategoryOutputDto[] = [];
}

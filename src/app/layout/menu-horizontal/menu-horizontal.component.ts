import { MenuInfoServiceProxy } from './../../shared/service-proxies/sys-service-proxies';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import {
  ICriteriaRequestDto,
  MenuQueryDto,
} from '../../shared/service-proxies/sys-service-proxies';
import { TrackElementInViewportDirective } from '../../core/directives/track-element-in-viewport.directive';

@Component({
  selector: 'app-menu-horizontal',
  standalone: true,
  imports: [MenubarModule, CommonModule, TrackElementInViewportDirective],
  templateUrl: './menu-horizontal.component.html',
  styleUrl: './menu-horizontal.component.scss',
})
export class MenuHorizontalComponent implements OnInit {

  apiDataService = inject(MenuInfoServiceProxy);
  cookieService = inject(CookieService);

  menus: MenuItem[] = [
    {
      label: 'Trang chủ',
      icon: 'pi pi-home',
      routerLink: '/home',
    },
    {
      label: 'Việc làm',
      icon: 'pi pi-briefcase',
      routerLink: '/jobs',
    }
  ];

  menuClass = 'shadow';

  ngOnInit(): void {
    // this.gets();
  }

  gets() {
    this.loadMenuHr().subscribe((data) => {
      this.menus = this.init(data);
    });
  }

  inViewportChange(isInViewport: any) {
    this.menuClass = isInViewport ? ' shadow' : 'shadow fixed';
  }

  private loadMenuHr() {
    return this.apiDataService.getList(
      MenuQueryDto.fromJS({
        language: 'vi',
        sorting: 'HashCode',
        tenantId: 1,
        useCache: false,
        view: 'LANGUAGE-KEYVALUE',
        criterias: [
          new ICriteriaRequestDto({
            propertyName: 'GroupCode',
            operation: 6,
            value: 'hr',
          }),
        ],
      })
    );
  }
  private init(list: any[]): any {
    const menuTop: any[] = [];
    const menuRight: any[] = [];
    const all: any[] = [];
    const map = new Map<number, any>();

    // Bước 1: Tạo node gốc với cấu trúc phù hợp menu
    list.forEach((item) => {
      map.set(item.id, {
        label: item.name,
        icon: item.icon || 'pi pi-copy',
        routerLink: item.link || null,
        items: [],
        id: item.id,
        parentId: item.parentId,
        index: item.index,
      });
    });

    let m: any[] = [];

    // Bước 2: Gắn children vào parent
    list.forEach((item) => {
      const node = map.get(item.id);
      if (item.parentId !== null && map.has(item.parentId)) {
        map.get(item.parentId).items.push(node);
      } else {
        m.push(node); // Root node
      }
    });
    m.sort((a, b) => a.index - b.index);
    // console.log(this.menus)
    return m;
  }
}

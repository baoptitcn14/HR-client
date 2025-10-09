import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { AppConst } from '../../shared/app-const';
import { AppSessionService } from '../../shared/session/app-session.service';
import { MenuItem } from 'primeng/api';
import { AppTenantService } from '../../shared/session/app-tenant.service';
import { ICriteriaRequestDto, MenuInfoServiceProxy, MenuQueryDto } from '../../shared/service-proxies/sys-service-proxies';

@Component({
  selector: 'app-top',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    OverlayPanelModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './top.component.html',
  styleUrl: './top.component.scss',
})
export class TopComponent implements OnInit {

  menuInfoService = inject(MenuInfoServiceProxy);

  listTenant: MenuItem[] | undefined;

  listRoute: MenuItem[] = [];

  formUyQuyen!: FormGroup;
  logoBrand = AppConst.logoBrand;
  urlLogin = AppConst.loginUrl;

  appTenantService = inject(AppTenantService);
  cookieSerivce = inject(CookieService);
  appSessionService = inject(AppSessionService);

  ngOnInit(): void {
    this.mapDataListTenant();

    this.loadMenuHr().subscribe((data) => {
      this.listRoute = this.init(data);

      this.listRoute.push(
        {
          label: 'Thoát',
          icon: 'pi pi-fw pi-sign-out',
          command: () => this.onLogout(),
          styleClass: 'text-danger',
        }
      )
    });
  }


  private loadMenuHr() {
    return this.menuInfoService.getList(
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
            value: 'user',
          }),
        ],
      })
    );
  }
  private init(list: any[]): any {
    const map = new Map<number, any>();

    // Bước 1: Tạo node gốc với cấu trúc phù hợp menu
    list.forEach((item) => {
      map.set(item.id, {
        label: item.name,
        icon: item.icon || 'pi pi-copy',
        url: item.link || null,
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

    return m;
  }

  private mapDataListTenant() {
    this.listTenant = this.appTenantService.listTeantUser ? this.appTenantService.listTeantUser.map((x) => ({
      label: x.name,
      icon: 'pi pi-building',
      command: () => this.appTenantService.onChangeTenant(x),
    })) : [];
  }

  onLogout() {
    this.appSessionService.logout();
  }

  onLogin() {
    window.location.href = AppConst.loginUrl;
  }

  onRegister() {
    window.location.href = AppConst.registerAccount;
  }

}

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
  listTenant: MenuItem[] | undefined;

  listRoute = [
    {
      label: 'Thông tin tài khoản',
      icon: 'pi pi-fw pi-info',
      routerLink: '/user-profile',
    },
    {
      label: 'Danh sách ứng dụng',
      icon: 'pi pi-fw pi-list',
      routerLink: '/join-application',
    },
    {
      label: 'Danh sách công ty',
      icon: 'pi pi-fw pi-building',
      routerLink: '/join-tenant',
    },
    {
      separator: true,
    },
    {
      label: 'Thoát',
      icon: 'pi pi-fw pi-sign-out',
      command: () => this.onLogout(),
    },
  ];

  formUyQuyen!: FormGroup;
  logoQlcv = AppConst.logoQlcvUrl;
  urlLogin = AppConst.loginUrl;

  appTenantService = inject(AppTenantService);
  cookieSerivce = inject(CookieService);
  appSessionService = inject(AppSessionService);

  ngOnInit(): void {
    this.mapDataListTenant();
  }

  private mapDataListTenant() {

    this.listTenant = this.appTenantService.listTeantUser ?this.appTenantService.listTeantUser.map((x) => ({
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

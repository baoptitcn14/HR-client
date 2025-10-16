import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { AppConst } from '../../shared/app-const';
import { AppSessionService } from '../../shared/session/app-session.service';
import { MenuItem } from 'primeng/api';
import { AppTenantService } from '../../shared/session/app-tenant.service';
import { ICriteriaRequestDto, MenuInfoServiceProxy, MenuQueryDto } from '../../shared/service-proxies/sys-service-proxies';
import { TranslatePipe, TranslateService, _ } from "@ngx-translate/core";
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    TranslatePipe,
  ],
  templateUrl: './top.component.html',
  styleUrl: './top.component.scss',
})
export class TopComponent implements OnInit {
  private translate = inject(TranslateService);
  menuInfoService = inject(MenuInfoServiceProxy);
  destroyRef = inject(DestroyRef);

  listTenant: MenuItem[] | undefined;

  listRoute: MenuItem[] = [];

  formUyQuyen!: FormGroup;
  logoBrand = AppConst.logoBrand;
  urlLogin = AppConst.loginUrl;

  appTenantService = inject(AppTenantService);
  cookieSerivce = inject(CookieService);
  appSessionService = inject(AppSessionService);

  logoutItem = {
    label: this.translate.instant(_('common.user.logout')),
    icon: 'pi pi-fw pi-sign-out',
    command: () => this.onLogout(),
  }

  registerButtonItems = this.loadRegisterButtonItems();

  ngOnInit(): void {
    this.mapDataListTenant();

    this.subcribeLang();

    this.loadMenuHr().subscribe(
      (listRoute) => {
        this.listRoute = this.init(listRoute);
        this.listRoute.push(this.logoutItem);
      }
    );

  }



  private subcribeLang() {
    // set lang to local storage
    this.translate.onLangChange.subscribe((event) => {

      this.logoutItem.label = this.translate.instant(_('common.user.logout'));

      this.registerButtonItems = this.loadRegisterButtonItems();

    });
  }

  private loadRegisterButtonItems() {
    return [
      {
        label: this.translate.instant(_('component.top.user_register')),
        icon: 'pi pi-user-plus',
        command: () => this.goToRegisterUser(),
      },
      {
        label: this.translate.instant(_('component.top.company_register')),
        icon: 'pi pi-building',
        command: () => this.goToRegisterCompany(),
      }
    ]
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

  goToRegisterUser() {
    window.location.href = AppConst.registerAccount;
  }

  goToRegisterCompany() {
    window.location.href = AppConst.registerCompany;
  }

}

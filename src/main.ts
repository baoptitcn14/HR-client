import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AppConst } from './app/shared/app-const';

fetch('assets/appsettings.json')
  .then((response) => response.json())
  .then((config) => {
    AppConst.domain = config.domain;
    AppConst.sysAPI = config.sysAPI;
    AppConst.baseUrl = config.baseUrl;
    AppConst.homeUrl = config.homeUrl;
    AppConst.appTitle = config.appTitle;
    AppConst.registerAccount = config.registerAccount;
    AppConst.logoBrand = config.logoBrand;
    AppConst.loginUrl = config.loginUrl;
    AppConst.languages = config.languages;
    AppConst.registerCompany = config.registerCompany;

    bootstrapApplication(AppComponent, appConfig)
      .catch((err) => console.error(err));

  });
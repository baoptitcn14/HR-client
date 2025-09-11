import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { PageViecLamComponent } from './pages/page-viec-lam/page-viec-lam.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { authRouteGuard } from './shared/auth-guard/auth-route.guard';
import { CreateCvComponent } from './pages/create-cv/create-cv.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'job/:id',
    component: PageViecLamComponent,
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [authRouteGuard]
  },
  {
    path: 'create-cv',
    component: CreateCvComponent,
    data: { title: 'Tạo CV', breadcrumb: 'Tạo CV' },
    canActivate: [authRouteGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent,
  },
];

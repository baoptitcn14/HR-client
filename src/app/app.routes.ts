import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { PageViecLamComponent } from './pages/page-viec-lam/page-viec-lam.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { authRouteGuard } from './shared/auth-guard/auth-route.guard';
import { CreateCvComponent } from './pages/create-cv/create-cv.component';
import { UserCvComponent } from './pages/user-cv/user-cv.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { ListJobComponent } from './pages/jobs/list-job/list-job.component';
import { FindComponent } from './pages/find/find.component';
import { ProfileComponent } from './pages/profile/profile.component';

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
    path: 'jobs',
    component: JobsComponent,
    data: { breadcrumb: 'common.breadcrumb.job' },
    children: [
      {
        path: '',
        component: ListJobComponent,
        data: { breadcrumb: 'common.breadcrumb.list' },
      },
      {
        path: 'filters/:filters',
        component: ListJobComponent,
        data: { breadcrumb: 'common.breadcrumb.list' },
      },
      {
        path: 'job/:slugId',
        component: PageViecLamComponent,
      }
    ]
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [authRouteGuard]
  },
  {
    path: 'user-cv',
    component: UserCvComponent,
    data: { title: 'CV của tôi', breadcrumb: 'common.breadcrumb.user_cv' },
    canActivate: [authRouteGuard]
  },
  {
    path: 'create-cv/:id',
    component: CreateCvComponent,
    data: { title: 'Chỉnh sửa CV', breadcrumb: 'common.breadcrumb.edit_cv' },
    canActivate: [authRouteGuard]
  },
  {
    path: 'create-cv',
    component: CreateCvComponent,
    data: { title: 'Tạo CV', breadcrumb: 'common.breadcrumb.create_cv' },
    canActivate: [authRouteGuard]
  },
  {
    path: 'find',
    component: FindComponent,
    data: { breadcrumb: 'common.breadcrumb.find' },
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    data: { breadcrumb: 'common.breadcrumb.profile' },
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent,
  },
];


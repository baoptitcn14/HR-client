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
    data: { breadcrumb: 'Việc làm' },
    children: [
      {
        path: '',
        component: ListJobComponent,
        data: { breadcrumb: 'Danh sách' },
      },
      {
        path: 'job/:slugId',
        component: PageViecLamComponent,
        data: { breadcrumb: 'Chi tiết công việc' },
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
    data: { title: 'CV của tôi', breadcrumb: 'CV của tôi' },
    canActivate: [authRouteGuard]
  },
  {
    path: 'create-cv/:id',
    component: CreateCvComponent,
    data: { title: 'Chỉnh sửa CV', breadcrumb: 'Chỉnh sửa CV' },
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


import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ICriteriaRequestDto, UserCVOutputDto, UserCVQueryDto, UserCVServiceProxy } from '../../shared/service-proxies/sys-service-proxies';
import { AppSessionService } from '../../shared/session/app-session.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-cv',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './user-cv.component.html',
  styleUrl: './user-cv.component.scss'
})
export class UserCvComponent implements OnInit {

  //  inject region
  private destroyRef = inject(DestroyRef);
  private userCvServiceProxy = inject(UserCVServiceProxy);
  private appSessionService = inject(AppSessionService);
  private router = inject(Router);

  // declare region

  userCvs: UserCVOutputDto[] = [];

  ngOnInit(): void {
    this.loadCv();
  }

  download(id: string) {
    this.router.navigate([`/cv/${id}`]);
  }

  goToEditPage(id: string) {
    this.router.navigate([`create-cv/${id}`]);
  }

  loadCv() {

    const input = new UserCVQueryDto();

    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'userId',
        operation: 0,
        value: this.appSessionService.userId + ''
      }),
      new ICriteriaRequestDto({
        propertyName: 'inputType',
        operation: 0,
        value: 'template'
      })
    ]

    this.userCvServiceProxy.getList(input).subscribe((res) => {
      this.userCvs = res;
    });
  }
}

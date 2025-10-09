import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { ICriteriaRequestDto, UserCVOutputDto, UserCVQueryDto, UserCVServiceProxy, ViewDto } from '../../shared/service-proxies/sys-service-proxies';
import { AppSessionService } from '../../shared/session/app-session.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-user-cv',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    ConfirmPopupModule,
    MessagesModule
  ],
  templateUrl: './user-cv.component.html',
  styleUrl: './user-cv.component.scss',
  providers: [ConfirmationService]
})
export class UserCvComponent implements OnInit {

  //  inject region
  private confirmationService = inject(ConfirmationService);
  private userCvServiceProxy = inject(UserCVServiceProxy);
  private appSessionService = inject(AppSessionService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // declare region
  @ViewChild('confirmPopupRef') confirmPopup!: ConfirmPopup;
  userCvs: UserCVOutputDto[] = [];

  //  message empty CV
  messages: Message[] = [
    { severity: 'info', detail: 'Bạn chưa có CV nào! Hãy nhanh tạo CV ngay!' }
  ];

  ngOnInit(): void {
    this.loadCv();
  }

  download(id: string) {
    this.router.navigate([`/cv/${id}`]);
  }

  goToEditPage(id: string) {
    this.router.navigate([`create-cv/${id}`]);
  }

  goToCreatePage() {
    this.router.navigate(['create-cv']);
  }

  remove(id: string) {

    const input = new ViewDto();
    input.id = id;

    this.userCvServiceProxy.deleteByTemplaceId(input).subscribe(() => {
      this.loadCv();

      this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa thành công', life: 3000 });

    })


  }

  confirm(event: Event, templateId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn mẫu muốn xóa cv này?',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Hủy bỏ',
      accept: () => {
        this.remove(templateId);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Đã hủy thao tác', life: 3000 });
      }
    });
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

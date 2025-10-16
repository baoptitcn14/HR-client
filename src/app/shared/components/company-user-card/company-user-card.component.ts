import { Component, DestroyRef, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TYPE_VIEW_CODE, TYPE_INTEREST, TYPE_ENTITY } from '../../../pages/profile/profile.component';
import { InterestServiceProxy, InterestInputDto } from '../../service-proxies/sys-service-proxies';
import { AppSessionService } from '../../session/app-session.service';
import { AppTenantService } from '../../session/app-tenant.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-company-user-card',
  standalone: true,
  imports: [
    FormsModule,
    AvatarModule,
    ButtonModule,
    RouterModule,
    TooltipModule,
    TranslatePipe
  ],
  templateUrl: './company-user-card.component.html',
  styleUrl: './company-user-card.component.scss'
})
export class CompanyUserCardComponent {

  // inject region
  interestService = inject(InterestServiceProxy);
  tenantService = inject(AppTenantService);
  appSessionService = inject(AppSessionService);
  messageService = inject(MessageService);

  @Input() data: any = {};
  @Input() typeView = '';

  onFollow() {
    if (this.data) {
      const input = new InterestInputDto();
      input.fromUserId = this.appSessionService.userId;
      input.entityId = this.data.id;
      input.typeFromUser = this.tenantService.currentTenant?.tenancyName;
      input.typeEntity =
        this.typeView == TYPE_VIEW_CODE.COMPANY
          ? TYPE_ENTITY.COMPANY
          : TYPE_ENTITY.USER;
      input.typeInterest = TYPE_INTEREST.FOLLOW;

      this.interestService.create(input).subscribe((res) => {

        const name = this.typeView == TYPE_VIEW_CODE.COMPANY ? this.data?.name : this.data?.surname;

        this.messageService.add({
          severity: 'success', detail: 'Đã theo dõi ' +
            name, life: 3000
        });
      });
    }

  }
}

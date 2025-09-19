import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { NumberSuffixCurrencyPipe } from '../../../core/pipes/number-suffix-currency.pipe';
import { JobPostOutputDto, CategoryOutputDto } from '../../service-proxies/sys-service-proxies';
import { ViecLamService } from './viec-lam.service';

@Component({
  selector: 'app-viec-lam',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    TagModule,
    DividerModule,
    SkeletonModule,
    RouterModule,
    NumberSuffixCurrencyPipe,
  ],
  templateUrl: './viec-lam.component.html',
  styleUrl: './viec-lam.component.scss'
})
export class ViecLamComponent implements AfterViewInit {

  viecLamService = inject(ViecLamService);



  @Input() viecLam?: IDsViecLam;
  @Input() last = false;

  //state loading 
  @Input() isLoading = true;

  ngAfterViewInit(): void {


    document.querySelectorAll('.viec-lam').forEach((viecLam) => {

      if (viecLam.clientHeight > this.viecLamService.maxHeight$.value) {
        this.viecLamService.maxHeight$.next(viecLam.clientHeight);
      }

    });

    if (this.last) {
      setTimeout(() => {
        this.viecLamService.height = this.viecLamService.maxHeight$.value;
      }, 500)
    }

  }

}

export interface IDsViecLam extends JobPostOutputDto {
  _kyNangsOpenJson: CategoryOutputDto[];
  _khuVucName: string;
  _tagsOpenJson: string[];
  _benefitsOpenJson: CategoryOutputDto[];
  _quyenLoisOpenJson: CategoryOutputDto[];
}


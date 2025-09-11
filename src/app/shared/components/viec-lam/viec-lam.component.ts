import { Component, inject, Input, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { NumberSuffixCurrencyPipe } from '../../../core/pipes/number-suffix-currency.pipe';
import { JobPostOutputDto, CategoryOutputDto } from '../../service-proxies/sys-service-proxies';

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
export class ViecLamComponent {

  @Input() viecLam?: IDsViecLam;

  //state loading
  @Input() isLoading = true;

}

export interface IDsViecLam extends JobPostOutputDto {
  _kyNangsOpenJson: CategoryOutputDto[];
  _khuVucName: string;
  _tagsOpenJson: string[];
  _benefitsOpenJson: CategoryOutputDto[];
  _quyenLoisOpenJson: CategoryOutputDto[];
}


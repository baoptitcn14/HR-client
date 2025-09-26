import { AfterViewInit, Component, DestroyRef, inject, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { NumberSuffixCurrencyPipe } from '../../../core/pipes/number-suffix-currency.pipe';
import { JobPostOutputDto, CategoryOutputDto } from '../../service-proxies/sys-service-proxies';
import { ViecLamService } from './viec-lam.service';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    ButtonModule
  ],
  templateUrl: './viec-lam.component.html',
  styleUrl: './viec-lam.component.scss'
})
export class ViecLamComponent implements AfterViewInit, OnDestroy {

  //inject
  private ngZone = inject(NgZone);
  private destroyRef = inject(DestroyRef);

  viecLamService = inject(ViecLamService);

  @Input() viecLam?: IDsViecLam;
  @Input() last = false;
  @Input() showButtonApply = false;
  //state loading 
  @Input() isLoading = true;

  height: number = 0;

  ngAfterViewInit(): void {

    this.viecLamService.height$.subscribe((height) => {
      this.height = height
    })

    this.ngZone.onStable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // DOM đã update xong sau khi data thay đổi
        document.querySelectorAll('.viec-lam').forEach((viecLam) => {
          if (viecLam.scrollHeight > this.viecLamService.maxHeight$.value) {
            this.viecLamService.maxHeight$.next(viecLam.scrollHeight);
          }
        });

        if (this.last) {
          this.viecLamService.height$.next(this.viecLamService.maxHeight$.value)
        }
      });

  }

  ngOnDestroy(): void {
    this.viecLamService.maxHeight$.next(0);;
  }

  onApply() {
    console.log(this.viecLam);
  }

}

export interface IDsViecLam extends JobPostOutputDto {
  _kyNangsOpenJson: CategoryOutputDto[];
  _khuVucName: string;
  _tagsOpenJson: string[];
  _benefitsOpenJson: CategoryOutputDto[];
  _quyenLoisOpenJson: CategoryOutputDto[];
}


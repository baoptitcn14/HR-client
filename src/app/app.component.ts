import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuHorizontalComponent } from './layout/menu-horizontal/menu-horizontal.component';
import { ToastModule } from 'primeng/toast';
import { TopComponent } from './layout/top/top.component';
import { LoadingComponent } from './layout/loading/loading.component';
import { PrimeNGConfig } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuHorizontalComponent,
    TopComponent,
    ToastModule,
    LoadingComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig, private title: Title) {
    title.setTitle('Việc làm');
  }
  ngOnInit(): void {
    this.primengConfig.setTranslation({
      cancel: 'Hủy',
      accept: 'Đồng ý',
      reject: 'Từ chối',
      //translations
      monthNames: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
      am: 'SA',
      pm: 'CH',
      today: 'Hôm nay',
      clear: 'Xóa',
      monthNamesShort: [
        'T1',
        'T2',
        'T3',
        'T4',
        'T5',
        'T6',
        'T7',
        'T8',
        'T9',
        'T10',
        'T11',
        'T12',
      ],
      dayNames: [
        'Chủ nhật',
        'Thứ hai',
        'Thứ ba',
        'Thứ tư',
        'Thứ năm',
        'Thứ sáu',
        'Thứ bảy',
      ],
      dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      choose: 'Chọn',
      chooseDate: 'Chọn ngày',
      chooseMonth: 'Chọn tháng',
      chooseYear: 'Chọn năm',
      contains: 'Bao gồm',
      notContains: 'Không bao gồm',
      equals: 'Bằng',
      notEquals: 'Không bằng',
      noFilter: 'Không bao gồm',
      lt: 'Nhỏ hơn',
      lte: 'Nhỏ hơn hoặc bằng',
      gt: 'Lớn hơn',
      gte: 'Lớn hơn hoặc bằng',
      dateIs: 'Ngày là',
      dateIsNot: 'Ngày khác',
      dateBefore: 'Ngày trước',
      dateAfter: 'Ngày sau',
      addRule: 'Thêm quyền',
      removeRule: 'Xóa quyền',
      apply: 'Áp dụng',
      medium: 'Trung bình',
      before: 'Trước',
      after: 'Sau',
      dateFormat: 'dd/mm/yy',
      emptySearchMessage: 'Không tìm được',
      emptyFilterMessage: 'Không tìm được',
      emptyMessage: 'Không có dữ liệu',
      emptySelectionMessage: 'Không có dữ liệu được chọn',
      endsWith: 'Kết thúc với',
      firstDayOfWeek: 1,
      nextDecade: 'Thập kỷ tiếp theo',
      nextMonth: 'Tháng sau',
      nextYear: 'Năm sau',
      is: 'là',
      isNot: 'không phải',
      nextHour: 'Giờ sau',
      nextMinute: 'Phút sau',
      nextSecond: 'Giây sau',
      pending: 'Đang xử lý',
      prevDecade: 'Thập kỷ trước',
      prevMonth: 'Tháng trước',
      prevYear: 'Năm trước',
      startsWith: 'Bắt đầu với',
      passwordPrompt: 'Độ mạnh mật khẩu',
      prevHour: 'Giờ trước',
      prevMinute: 'Phút trước',
      prevSecond: 'Giây trước',
      searchMessage: 'Tìm tin nhắn',
      selectionMessage: 'Chọn tin nhắn',
      strong: 'Mạnh',
      weak: 'Yếu',
      weekHeader: 'Tuần',
      upload: 'Tải lên',
    });
  }
}

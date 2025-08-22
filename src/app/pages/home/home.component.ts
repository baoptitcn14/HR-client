import { Component, inject, OnInit } from '@angular/core';
import { SectionSearchComponent } from '../../layout/section-search/section-search.component';
import { DsViecLamComponent, IDsViecLam } from '../../shared/components/ds-viec-lam/ds-viec-lam.component';
import { JobPostInfoServiceProxy, JobPostOutputDto, JobPostQueryDto } from '../../shared/service-proxies/sys-service-proxies';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SectionSearchComponent, DsViecLamComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    jobPosts = [
    {
      logo: 'https://static.topcv.vn/company_logos/professionnel.png',
      title: 'Nhân Viên Kinh Doanh/ Sales/ Tư Vấn Bán Hàng - Thu Nhập 20-40 Triệu',
      company: 'CÔNG TY TNHH QUỐC TẾ HAUTE MAISON',
      salary: '20 - 40 triệu',
      location: 'Hà Nội, Hồ Chí Minh',
      tags: [],
    },
    {
      logo: 'https://static.topcv.vn/company_logos/aztek.png',
      title: 'Quản Lý Kho Hàng Kiêm Nhân Viên Đóng Hàng',
      company: 'CÔNG TY TNHH ĐẦU TƯ THƯƠNG MẠI AZ-TEK',
      salary: 'Tới 15 triệu',
      location: 'Hà Nội',
      tags: [],
    },
    {
      logo: 'https://static.topcv.vn/company_logos/apollo.png',
      title: 'Chuyên Viên Tư Vấn Giáo Dục/Sales...',
      company: 'Tổ chức Giáo dục và Đào tạo Apollo Việt Nam',
      salary: 'Tới 30 triệu',
      location: 'Hà Nội & 14 nơi khác',
      tags: [
        { label: 'TOP', style: 'p-chip-success' },
        { label: 'NỔI BẬT', style: 'p-chip-warning' },
        { label: 'HOT', style: 'p-chip-danger' },
      ],
    },
    {
      logo: 'https://static.topcv.vn/company_logos/khangland.png',
      title: 'Nhân Viên Kinh Doanh Tại Thanh Xuân, Hà Nội - Thu Nhập Từ 100 Triệu',
      company: 'CÔNG TY CỔ PHẦN ĐẦU TƯ VÀ KHANG PHÁT',
      salary: 'Từ 100 triệu',
      location: 'Hà Nội',
      tags: [],
    },
    {
      logo: 'https://static.topcv.vn/company_logos/concentrix.png',
      title: 'Nhân Viên Điều Phối Thanh Toán & Hỗ Trợ Sau Vay (Giờ Hành Chính)',
      company: 'CÔNG TY TNHH VIETNAM CONCENTRIX SERVICES',
      salary: 'Tới 15 triệu',
      location: 'Hồ Chí Minh',
      tags: [],
    },
    {
      logo: 'https://static.topcv.vn/company_logos/tlg.png',
      title: 'Giám Sát Bán Hàng - Màng Sơn',
      company: 'CÔNG TY CỔ PHẦN SẢN XUẤT TLG VIỆT NAM',
      salary: '15 - 30 triệu',
      location: 'Hà Nội & 30 nơi khác',
      tags: [],
    },
  ];
  isHighlighted(tags?: { label: string; style?: string }[]): boolean {
  return !!tags?.some(t => t.label === 'TOP');
}
  // region inject
  jobPostInfoServiceProxy = inject(JobPostInfoServiceProxy);

  // declare data

  ngOnInit(): void {
    this.getJobPosts();
  }


  //get data
  private getJobPosts() {

    const input = new JobPostQueryDto();
    input.skipCount = 0;
    input.maxResultCount = 100;

    this.jobPostInfoServiceProxy.getAll(input).subscribe((res) => {
     // this.jobPosts = res.items as IDsViecLam[];
    });
  }
}

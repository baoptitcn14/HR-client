import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { TreeSelectModule, TreeSelectNodeExpandEvent } from 'primeng/treeselect';
import { CategoryInfoServiceProxy, CategoryOutputDto, CategoryQueryDto, ICriteriaRequestDto } from '../../service-proxies/sys-service-proxies';
import { AppConst } from '../../app-const';
import { FormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { TreeFilterEvent } from 'primeng/tree';

@Component({
  selector: 'app-chon-nganh-nghe',
  standalone: true,
  imports: [
    TreeSelectModule,
    FormsModule
  ],
  templateUrl: './chon-nganh-nghe.component.html',
  styleUrl: './chon-nganh-nghe.component.scss'
})
export class ChonNganhNgheComponent implements OnInit {
  private categoryInfoService = inject(CategoryInfoServiceProxy);
  private cd = inject(ChangeDetectorRef);

  @Input() danhSachNganhNgheDaChonInput: CategoryOutputDto[] = [];
  @Input() danhSachNganhNgheInput: CategoryOutputDto[] = [];
  @Input() isLoadDsNganhNgheDefault = true;

  danhSachNganhNgheDaChon: TreeNode[] = [];
  danhSachNganhNgheHienThi: TreeNode[] = [];

  loading = false;

  ngOnInit(): void {
    this.loadDuLieu();
  }

  //#region Xử lý các sự kiện trên giao diện

  // xử lý khi mở node cha
  onNodeExpand(event: TreeSelectNodeExpandEvent) {

    this.loading = true;
    const node = { ...event.node };

    if (!event.node.children) {
      setTimeout(() => {

        node.children = this.mapDuLieuSangTreeNode(this.danhSachNganhNgheInput.filter(x => x.parentId == node.key), node);

        const index = this.danhSachNganhNgheHienThi.findIndex(x => x.key == node.key);

        if (index > -1)
          this.danhSachNganhNgheHienThi[index] = node;

        this.loading = false;
        this.cd.markForCheck();
      }, 500)
    } else this.loading = false;

  }

  //#endregion

  //#region LOAD DATA

  private loadDuLieu() {
    if (this.isLoadDsNganhNgheDefault)
      this.loadDsNganhNgheDefault().subscribe(data => {

        this.danhSachNganhNgheInput = [...this.danhSachNganhNgheInput, ...data];

        const parents = this.danhSachNganhNgheInput.filter(x => !x.parentId);

        // sắp xếp theo label asc
        this.danhSachNganhNgheHienThi =
          this.mapDuLieuSangTreeNode(parents).sort((a, b) => a.label!.localeCompare(b.label!));

        // gán node cha cho các nodes
        this.danhSachNganhNgheHienThi.forEach(x => {
          x.children = this.mapDuLieuSangTreeNode(this.danhSachNganhNgheInput.filter(e => e.parentId == x.key), x);
        })
      })
    else {

      const parents = this.danhSachNganhNgheInput.filter(x => !x.parentId);

      // sắp xếp theo label asc
      this.danhSachNganhNgheHienThi = this.mapDuLieuSangTreeNode(parents).sort((a, b) => a.label!.localeCompare(b.label!));

      // gán node cha cho các nodes
      this.danhSachNganhNgheHienThi.forEach(x => {
        x.children = this.mapDuLieuSangTreeNode(this.danhSachNganhNgheInput.filter(e => e.parentId == x.key), x);
      })
    }
  }

  private mapDuLieuSangTreeNode(data: CategoryOutputDto[], parent?: TreeNode) {
    return data.map((item: CategoryOutputDto, i) => ({
      key: item.id,
      label: item.name ?? '',
      leaf: this.danhSachNganhNgheInput.findIndex(x => x.parentId == item.id) < 0,
      checked: this.danhSachNganhNgheDaChonInput.findIndex(x => x.id == item.id) > -1,
      parent: parent,
      index: i
    }));
  }

  private loadDsNganhNgheDefault() {
    return this.categoryInfoService.getList(
      CategoryQueryDto.fromJS({
        tenantId: AppConst.tenantDefaultId,
        criterias: [
          new ICriteriaRequestDto(
            {
              propertyName: 'groupCode',
              operation: 0,
              value: 'INDUSTRY'
            }
          )
        ]
      })
    )
  }


  //#endregion

}

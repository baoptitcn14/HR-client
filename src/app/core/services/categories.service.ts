import { inject, Injectable } from '@angular/core';
import { CategoryInfoServiceProxy, CategoryOutputDto, CategoryQueryDto, ICriteriaRequestDto } from '../../shared/service-proxies/sys-service-proxies';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  // inject region
  categoryServiceProxy = inject(CategoryInfoServiceProxy);

  // inject end region

  private data: { [key: string]: { [key: number]: CategoryOutputDto[] } } = {};

  constructor() { }

  getCategories(groupCode: string, tenantId?: number) {
    const input = new CategoryQueryDto();

    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'groupCode',
        operation: 0,
        value: groupCode
      }),
      new ICriteriaRequestDto({
        propertyName: 'status',
        operation: 0,
        value: 'DEFAULT'
      })
    ];

    input.tenantId = tenantId ?? 1;
    input.sorting = 'hashCode asc';

    return this.categoryServiceProxy.getList(input);
  }

  // lấy danh sách category, nếu chưa có thì lấy từ api và lưu lại
  async getDataCategory(groupCode: string, tenantId: number) {
    if (this.data[groupCode] && this.data[groupCode][tenantId]) {
      return this.data[groupCode][tenantId];

    }
    else {
      const data = await firstValueFrom(this.getCategories(groupCode, tenantId));

      this.data[groupCode] = this.data[groupCode] ?? {};
      this.data[groupCode][tenantId] = data;


      return data;
    };
  }
}

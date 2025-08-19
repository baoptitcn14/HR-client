import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';
import { ExtendedSSOOrganizationDto } from '../components/user-org-select/user-org-select.component';

@Pipe({
  name: 'searchOrgUser',
  standalone: true,
})
export class SearchOrgUserPipe implements PipeTransform {
  transform(
    value: ExtendedSSOOrganizationDto[],
    data: { search: string; sortOption: string }
  ): any[] {
    const translationDictionary = (str: string): string => {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
      str = str.replace(/đ/g, 'd');
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
      str = str.replace(/Đ/g, 'D');
      return str;
    };

    if (data.search === '') {
      if (data.sortOption.startsWith('org-')) {
        const option = data.sortOption.split('-')[1] as 'asc' | 'desc';
        return _.orderBy(value, ['code', 'name'], ['asc', option]);
      } else if (data.sortOption.startsWith('user-')) {
        const option = data.sortOption.split('-')[1] as 'asc' | 'desc';
        return value.map((item) => {
          item._filteredListUser = item.listUser!.sort((a, b) =>
            option == 'asc'
              ? a['info']!.localeCompare(b['info']!)
              : b['info']!.localeCompare(a['info']!)
          );
          
          return item;
        });
      }

      return value;
    } else {
      if (data.sortOption.startsWith('org-')) {
        const option = data.sortOption.split('-')[1] as 'asc' | 'desc';

        return _.orderBy(
          value.filter((item, i, array) =>
            translationDictionary(item.name!.toLowerCase()).includes(
              translationDictionary(data.search.toLowerCase())
            )
          ),
          ['code', 'name'],
          ['asc', option]
        );
      } else if (data.sortOption.startsWith('user-')) {
        const option = data.sortOption.split('-')[1] as 'asc' | 'desc';

        return value
          .map((item, i, array) => {
            const listUserCopy = _.cloneDeep(item.listUser!);

            const listUserMatch = listUserCopy.filter((user) =>
              translationDictionary(user.name!.toLowerCase()).includes(
                translationDictionary(data.search.toLowerCase())
              )
            );

            item._filteredListUser = listUserMatch.sort((a, b) =>
              option == 'asc'
                ? a['info']!.localeCompare(b['info']!)
                : b['info']!.localeCompare(a['info']!)
            );

            item._isToggled = listUserMatch.length > 0;

            return item;
          })
          .filter((item) => item._isToggled);
      }

      return value;
    }
  }
}

/* #region  import */
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  FormControl,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
/* #endregion */
export class ValidatorsService {

  /* #region   kiem tra index trung thieo cap bac cha con */
  setValidatorIndex(
    parentId: FormControl,
    list: any[],
    currentId: FormControl
  ): ValidatorFn {
    return (index: AbstractControl): { [key: string]: any } | null => {
      var arr = list;
      if (parentId.value) {
        var parent = _.find(list, ['id', parentId.value]);
        var code = parent.code + '.';
        var order = parent.order + 1;
        arr = _.filter(list, (item) => {
          return (
            _.startsWith(item.code, code) &&
            order == item.order &&
            item.id != currentId.value
          );
        });
      } else {
        arr = _.filter(list, (item) => {
          return !item.parentId && item.id != currentId.value;
        });
      }
      var found = _.find(arr, ['index', parseInt(index.value)]);
      return found ? { duplicate: true } : null;
    };
  }
  /* #endregion */

  /* #region  kiem tra index trung` (k cha con) */
  setValidatorIndex2(list: any[], currentId: FormControl): ValidatorFn {
    return (index: AbstractControl): { [key: string]: any } | null => {
      var found = _.find(list, (item) => {
        return item.index == parseInt(index.value) && item.id != currentId;
      });

      return found ? { duplicate: true } : null;
    };
  }
  /* #endregion */

  /* #region  kiem tra mat khau */
  comparePassword = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    return control.get('password')!.value ==
      control.get('passwordConfirm')!.value
      ? null
      : { notSame: true };
  };

  /* #endregion */

  /* #region  so sanh 2 gia tri = nhau */
  compareEqualValue(controlB: FormControl) {
    return (controlA: AbstractControl): { [key: string]: any } | null => {
      var valueA = controlA.value;
      var valueB = controlB.value;
      return valueA === valueB ? null : { notSame: true };
    };
  }
  /* #endregion */

  /* #region  nut cho phep */
  checkAcceptTerm(control: AbstractControl): ValidationErrors | null {
    return control.value ? null : { acceptTerm: true };
  }
  /* #endregion */

  /* #region  reset lai validation cua control */
  resetValidation(control: FormControl) {
    control.updateValueAndValidity();
  }
  /* #endregion */

  checkDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;

      return control.value instanceof Date && !isNaN(control.value.valueOf())
        ? null
        : { notDate: true };
    };
  }

  checkNumber(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;

      return typeof control.value != 'number' ? { notNumber: true } : null;
    };
  }

}

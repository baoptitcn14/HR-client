import { CommonModule } from '@angular/common';
import { Component, forwardRef, Inject, Input } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  AbstractControl,
  ValidationErrors,
  Validator,
  ControlValueAccessor,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'm-files',
  templateUrl: './m-files.component.html',
  styleUrls: ['./m-files.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MFilesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MFilesComponent),
      multi: true,
    },
  ],
})
export class MFilesComponent implements Validator, ControlValueAccessor {
  @Input() inputId!: string | undefined;
  @Input() multiple!: boolean;
  @Input() hiddenListFile!: boolean;
  @Input() hidden!: boolean;
  @Input() onlyImage!: boolean;
  @Input() accept!: string;
  @Input() maxFileSize!: number;
  @Input() disabled!: boolean;
  value: any;
  onChange: ((data: any) => void) | undefined;

  errors!: Errors;
  message = 'Nhấp để xem';

  listErrors: { key: string; message: string }[] = [];

  constructor(
    @Inject(NgxImageCompressService)
    private imageCompress: NgxImageCompressService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {}
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.hasValidator(Validators.required)) {
      if (
        control.value !== null &&
        control.value !== undefined &&
        control.value !== '' &&
        control.value.length > 0
      ) {
        delete this.errors.required;
        this.deleteErrorByKey('required');
      } else {
        if (!this.errors) this.errors = { required: undefined };
        this.errors.required = 'Không bỏ trống!';
        this.addError('required', 'Không bỏ trống!');
      }
    }

    return this.errors ? this.errors : null;
  }
  writeValue(obj: any): void {
    this.value = !obj ? [] : obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }

  async onChangeValue(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (!this.multiple) this.value.length = 0;

      var files = event.target.files;

      if (this.onlyImage == true || this.accept === 'image/*')
        for (let i = 0; i < files.length; i++) {
          if (this.isFileImage(files[i].type) == false) {
            this.messageService.add({
              severity: 'error',
              summary: 'File Uploaded',
              detail: 'Chỉ được chọn file hình',
            });
            return;
          }
        }

      if (this.maxFileSize)
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > this.maxFileSize * 1024 * 1024) {
            this.messageService.add({
              severity: 'error',
              summary: 'File Uploaded',
              detail:
                'Kích thước file vượt quá tren ' + this.maxFileSize + ' MB',
            });
            return;
          }
        }

      for (let i = 0; i < files.length; i++) {
        var file = files[i];

        file = await this.getBase64ImageFromFile(file);
        file._url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        );
        file.src = this.getThumbnailFile(file);

        this.value.push(file);
      }
    } else {
      if (!this.multiple && this.value.length > 0) this.value.length = 0;
    }

    this.handler();
  }

  handler() {
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  get isNew() {
    return !this.value || this.value.length == 0;
  }

  getThumbnailFile(file: any) {
    if (file.type.indexOf('image') != -1) {
      return file.fileUrl ? file.fileUrl : file.data;
    } else if (
      file.type.indexOf(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) != -1 ||
      file.type.indexOf('application/vnd.ms-excel') != -1
    )
      return '/assets/img/files/xlsx.svg';
    else if (file.type.indexOf('video/mp4') != -1)
      return '/assets/img/files/mp4.svg';
    else if (file.type.indexOf('audio/mp3') != -1)
      return '/assets/img/files/mp3.svg';
    else if (file.type.indexOf('text/plain') != -1)
      return '/assets/img/files/file.png';
    else if (file.type.indexOf('application/pdf') != -1)
      return '/assets/img/files/pdf.svg';
    else if (
      file.type.indexOf(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) != -1
    )
      return '/assets/img/files/doc.svg';
    return '/assets/media/files/file.png';
  }

  isValidNameFile(name: string) {
    let i = name.lastIndexOf('.');
    const extension = name.substring(i, name.length);
    return (
      name
        .replace(extension, '')
        .replace(
          /\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\{|\}|\[|\]|\\|\:|\;|\"|\'|\<|\>|\,|\.|\?|\//g,
          '-'
        ) + extension
    );
  }

  onRemoveFile(index: number, event: any) {
    event.preventDefault();

    this.value.splice(index, 1);
    this.handler();
  }

  private isFileImage(type: string) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return acceptedImageTypes.findIndex((e) => e == type) > -1 ? true : false;
  }

  getBase64ImageFromFile(file: FileDto) {
    return new Promise<FileDto>((resolve, reject) => {
      let self = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        file.data = reader.result as string;

        if (file.type.indexOf('image') != -1)
          self.compressFile(file).then((result) => {
            file.data = result;
            // let regex = /data:([a-zA-z0-9/.\-\;]{0,})([,]{1})/gi;
            // file.data = file.data.replace(regex, "");
            resolve(file);
          });
        else {
          // let regex = /data:([a-zA-z0-9/.\-\;]{0,})([,]{1})/gi;
          // file.data = file.data?.replace(regex, "");
          // file.src = self.getThumbnailFile(file);
          resolve(file);
        }
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  }

  private compressFile(image: any) {
    return this.imageCompress.compressFile(image.data, -1, 75, 50);
  }

  downloadFile(url: string) {
    window.open(url, '_blank');
  }

  private deleteErrorByKey(key: string) {
    const index = this.listErrors.findIndex((e) => e.key == key);
    if (index > -1) this.listErrors.splice(index, 1);
  }

  private addError(key: string, message: string) {
    const index = this.listErrors.findIndex((e) => e.key == key);
    if (index < 0)
      this.listErrors.push({
        key: key,
        message: message,
      });
  }
}

interface FileDto extends File {
  data: string | null;
  _url: string | SafeUrl | null;
  src: string | null;
  name: string;
}

export interface Errors {
  required?: string | undefined;
  regex?: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
  notMatch?: boolean | undefined;
}

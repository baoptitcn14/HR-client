// import * as ClassicEditor from 'src/assets/js/ckeditorV31/ckeditor.js';

export class AppConst {

  //#region ENVIRONMENT
  static domain: string;
  static sysAPI: string;
  static baseUrl: string;
  static loginUrl: string;
  static homeUrl: string;
  static appTitle: string;
  static registerAccount: string;
  //#endregion


  static readonly authorization = {
    encrptedAuthTokenName: 'enc_auth_token',
    authToken: 'AuthToken',
    userId: 'UserId',
    tenantId: 'TenantId',
    active: 'Active'    
  };

  static readonly idZero = '00000000-0000-0000-0000-000000000000';

  static readonly messageToastr = {
    success: {
      insert: 'Thêm thành công!',
      update: 'Cập nhật thành công!',
      delete: 'Xóa thành công!',
    },
    error: {
      insert: 'Thêm thất bại!',
      update: 'Cập nhật thất bại!',
      delete: 'Xóa thất bại!',
    },
  };

  static readonly keySetting = {
    TENANT_INFO: 'TENANT_INFO',
  };

  static readonly tenantProfile = {
    tenantName: 'Công ty Ilearn',
    hotline: '089 639 6969',
    ext: '0258 3511 259',
    email: 'toancoyen@ilearn.net.vn',
    address: [
      {
        code: 'MDC',
        name: 'Trụ sở chính',
        address:
          '27A Mạc Đĩnh Chi - Phường Phước Tiến - TP Nha Trang - Tỉnh Khánh Hoà',
      },
      {
        code: 'HQ',
        name: 'Cơ sở 2',
        address:
          'STH 18.33, Đường 4D+8C, KĐT Hà Quang 2 - TP Nha Trang - Tỉnh Khánh Hoà',
      },
    ],
  };

  static readonly logoQlcvUrl = './logo_qlcv.png';

  // static readonly editor = ClassicEditor;
  static readonly placehoderImage = 'https://placehold.co/300x200';

  static readonly emptySearchMessage = 'Không tìm thấy thông tin';

  static readonly emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  static readonly tenantDefaultId = 1;
}

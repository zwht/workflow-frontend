/*
 * @Descripttion:
 * @version:
 * @Author: zhaowei
 * @Date: 2019-04-24 15:35:22
 * @LastEditors: zhaowei
 * @LastEditTime: 2019-11-14 17:51:35
 */
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import {
  SFSchema,
  SFUISchema,
  FormProperty,
  PropertyGroup,
  SFComponent,
} from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { delay, map } from 'rxjs/operators';
import { TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
@Component({
  selector: 'app-user-index-edit',
  templateUrl: './edit.component.html',
})
export class UserIndexEditComponent implements OnInit {
  @ViewChild('sf') sf: SFComponent;
  title = '添加';
  cpName = '用户';
  id = this.route.snapshot.queryParams.id;
  i: any;
  commonSchema: SFSchema['properties'] = {};
  schema: SFSchema = {};
  ui: SFUISchema = {};
  hiddenGx = true;
  constructor(
    private route: ActivatedRoute,
    public location: Location,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private settingsService: SettingsService,
  ) {
    const co: SFSchema['properties'] = {
      loginName: { type: 'string', title: '登录名', maxLength: 10 },
      name: { type: 'string', title: '真实名', maxLength: 10 },
      phone: { type: 'string', title: '手机号', maxLength: 11, minLength: 11 },
      roles: { type: 'string', title: '用户角色', default: [106] },
      gxIds: {
        type: 'string',
        title: '生产工序',
        default: [],
      },
      inviteId: {
        type: 'string',
        title: '销售',
        default: '',
      },
      address: {
        type: 'string',
        title: '默认收货地址',
        default: '',
      },
      brandId: {
        type: 'string',
        title: '默认品牌',
        default: '',
      },
    };
    if (this.settingsService.user.roles.indexOf('888888') !== -1) {
      this.commonSchema = {
        corporationId: { type: 'string', title: '公司' },
        ...co,
      };
    } else {
      this.commonSchema = co;
    }
    this.ui = {
      '*': {
        spanLabelFixed: 100,
        width: 500,
      },
      $type: {
        widget: 'string',
      },
      $name: {
        widget: 'string',
      },
      $phone: {
        widget: 'string',
      },
      $password: {
        widget: 'string',
        type: 'password',
      },
      $password1: {
        widget: 'string',
        type: 'password',
        validator: (
          value: any,
          formProperty: FormProperty,
          form: PropertyGroup,
        ) => {
          if (form.value && form.value.password != null && value != null) {
            return form.value.password === value
              ? []
              : [{ keyword: 'format', message: '两次密码不相同！' }];
          } else {
            return [];
          }
        },
      },
      $roles: {
        widget: 'select',
        mode: 'multiple',
        change: e => {
          this.hiddenGx = true;
        },
        asyncData: (name: string) => {
          return this.http
            .post(
              './v1/public/code/list',
              { valueStart: 100, valueEnd: 200 },
              { pageNum: 1, pageSize: 1000 },
            )
            .pipe(
              // delay(1200),
              map((item: ResponseVo) => {
                if (!item.response.data.length) return [];
                return item.response.data.map(obj => {
                  return {
                    label: obj.name,
                    value: obj.value,
                  };
                });
              }),
            );
        },
      },
      $gxIds: {
        widget: 'select',
        mode: 'multiple',
        visibleIf: {
          roles: (value: any) => {
            if (value && value.indexOf(106) !== -1) {
              return true;
            }
            return false;
          },
        },
        asyncData: (name: string) => {
          return this.http
            .post('./v1/gx/list', {}, { pageNum: 1, pageSize: 1000 })
            .pipe(
              // delay(1200),
              map((item: ResponseVo) => {
                if (!item.response.data.length) return [];
                return item.response.data.map(obj => {
                  return {
                    label: obj.name,
                    value: obj.id,
                  };
                });
              }),
            );
        },
      },
      $inviteId: {
        widget: 'select',
        visibleIf: {
          roles: (value: any) => {
            if (value && value.indexOf(102) !== -1) {
              return true;
            }
            return false;
          },
        },
        asyncData: (name: string) => {
          return this.http
            .post(
              './v1/user/list',
              {
                roles: '101'
              },
              { pageNum: 1, pageSize: 1000 },
            )
            .pipe(
              // delay(1200),
              map((item: ResponseVo) => {
                if (!item.response.data.length) return [];
                return item.response.data.map(obj => {
                  return {
                    label: obj.name,
                    value: obj.id,
                  };
                });
              }),
            );
        },
      },
      $address: {
        widget: 'input',
        visibleIf: {
          roles: (value: any) => {
            if (value && value.indexOf(102) !== -1) {
              return true;
            }
            return false;
          },
        },
      },
      $brandId: {
        widget: 'select',
        visibleIf: {
          roles: (value: any) => {
            if (value && value.indexOf(102) !== -1) {
              return true;
            }
            return false;
          },
        },
        asyncData: (name: string) => {
          return this.http
            .post(
              './v1/brand/list',
              {
              },
              { pageNum: 1, pageSize: 10 },
            )
            .pipe(
              // delay(1200),
              map((item: ResponseVo) => {
                if (!item.response.data.length) return [];
                return item.response.data.map(obj => {
                  return {
                    label: obj.name,
                    value: obj.id,
                  };
                });
              }),
            );
        },
      },
      $corporationId: {
        widget: 'select',
        asyncData: (name: string) => {
          return this.http
            .post(
              './v1/corporation/list',
              { valueStart: 101, valueEnd: 999 },
              { pageNum: 1, pageSize: 1000 },
            )
            .pipe(
              // delay(1200),
              map((item: ResponseVo) => {
                if (!item.response.data.length) return [];
                return item.response.data.map(obj => {
                  return {
                    label: obj.name,
                    value: obj.id,
                  };
                });
              }),
            );
        },
      },
    };

    this.schema = !this.id
      ? {
          properties: {
            ...this.commonSchema,
            password: { type: 'string', title: '密码', maximum: 30 },
            password1: { type: 'string', title: '再次输入密码', maximum: 30 },
          },
          required: [
            'loginName',
            'corporationId',
            'name',
            'password',
            'password1',
            'roles',
            'phone',
          ],
        }
      : {
          properties: {
            ...this.commonSchema,
          },
          required: ['loginName', 'corporationId', 'name', 'roles', 'phone'],
        };
  }

  ngOnInit(): void {
    if (this.id) {
      this.title = '编辑';
      this.http
        .get(`./v1/user/getById?id=${this.id}`)
        .subscribe((res: ResponseVo) => {
          res.response.roles = res.response.roles
            ? res.response.roles.split(',').map(item => {
                return parseInt(item, 10);
              })
            : [];
          res.response.gxIds = res.response.gxIds
            ? JSON.parse(res.response.gxIds)
            : [];
          this.i = res.response;
        });
    } else {
      this.i = {};
    }
  }
  save(value: any) {
    if (value.roles && typeof value.roles !== 'string' && value.roles.length) {
      value.roles = value.roles.join(',');
    }
    if (value.gxIds) {
      value.gxIds = JSON.stringify(value.gxIds);
    }
    if (this.id) {
      this.http.post(`./v1/user/update`, value).subscribe(res => {
        this.msgSrv.success('修改成功');
        this.location.back();
      });
    } else {
      value.password = btoa(encodeURIComponent(value.password));
      this.http.post(`./v1/user/add`, value).subscribe(res => {
        this.msgSrv.success('添加成功');
        this.location.back();
      });
    }
  }
}

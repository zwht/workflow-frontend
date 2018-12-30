import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { SFSchema, SFUISchema, FormProperty, PropertyGroup, SFComponent } from '@delon/form';
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
  commonSchema: SFSchema['properties'] = {

  };
  schema: SFSchema = {};
  ui: SFUISchema = {};
  constructor(
    private route: ActivatedRoute,
    public location: Location,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private settingsService: SettingsService
  ) {
    const co: SFSchema['properties'] = {
      loginName: { type: 'string', title: '登录名', maxLength: 10 },
      name: { type: 'string', title: '真实名', maxLength: 10 },
      phone: { type: 'string', title: '手机号', maxLength: 11, minLength: 11 },
      roles: { type: 'string', title: '用户角色', default: 150 }
    };
    let roleK = 101;
    if (this.settingsService.user.roles.indexOf('888888') !== -1) {
      this.commonSchema = {
        corporationId: { type: 'string', title: '公司' },
        ...co
      };
      roleK = 100;
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
        validator: (value: any, formProperty: FormProperty, form: PropertyGroup) => {
          if (form.value && form.value.password != null && value != null) {
            return form.value.password === value ? [] : [{ keyword: 'format', message: '两次密码不相同！' }];
          } else {
            return [];
          }
        }
      },
      $roles: {
        widget: 'select',
        mode: 'tags',
        asyncData: (name: string) => {
          return this.http.post('/cfmy/public/code/list',
            { valueStart: roleK, valueEnd: 999 },
            { pageNum: 1, pageSize: 1000 })
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
              })
            );
        },
      },
      $corporationId: {
        widget: 'select',
        asyncData: (name: string) => {
          return this.http.post('/cfmy/corporation/list',
            { valueStart: 101, valueEnd: 999 },
            { pageNum: 1, pageSize: 1000 })
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
              })
            );
        },
      }
    };

    this.schema = !this.id ? {
      properties: {
        ...this.commonSchema,
        password: { type: 'string', title: '密码', maximum: 30 },
        password1: { type: 'string', title: '再次输入密码', maximum: 30 },
      },
      required: ['loginName', 'corporationId', 'name', 'password', 'password1', 'roles', 'phone'],
    } : {
        properties: {
          ...this.commonSchema
        },
        required: ['loginName', 'corporationId', 'name', 'roles', 'phone'],
      };
  }

  ngOnInit(): void {
    if (this.id) {
      this.title = '编辑';
      this.http.get(`/cfmy/user/getById?id=${this.id}`)
        .subscribe((res: ResponseVo) => {
          res.response.roles = res.response.roles ? res.response.roles.split(',').map(item => {
            return parseInt(item, 10);
          }) : [];
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
    if (this.id) {
      this.http.post(`/cfmy/user/update`, value).subscribe(res => {
        this.msgSrv.success('修改成功');
        this.location.back();
      });
    } else {
      value.password = btoa(encodeURIComponent(value.password));
      this.http.post(`/cfmy/user/add`, value).subscribe(res => {
        this.msgSrv.success('添加成功');
        this.location.back();
      });
    }
  }
}

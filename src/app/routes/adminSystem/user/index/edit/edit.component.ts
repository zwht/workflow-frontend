import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, FormProperty, PropertyGroup } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';

@Component({
  selector: 'app-user-index-edit',
  templateUrl: './edit.component.html',
})
export class UserIndexEditComponent implements OnInit {
  title = '添加';
  cpName = '用户';
  id = this.route.snapshot.queryParams.id;
  i: any;
  schema: SFSchema = !this.id ? {
    properties: {
      loginName: { type: 'string', title: '登录名', maxLength: 10 },
      name: { type: 'string', title: '真实名', maxLength: 10 },
      password: { type: 'string', title: '密码', maximum: 30 },
      password1: { type: 'string', title: '再次输入密码', maximum: 30 },
    },
    required: ['loginName', 'name', 'password', 'password1'],
  } : {
      properties: {
        loginName: { type: 'string', title: '登录名', maxLength: 10 },
        name: { type: 'string', title: '真实名', maxLength: 10 },
      },
      required: ['loginName', 'name'],
    };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      width: 300,
    },
    $type: {
      widget: 'string',
    },
    $name: {
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
  };
  constructor(
    private route: ActivatedRoute,
    public location: Location,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.id) {
      this.title = '编辑';
      this.http.get(`/cfmy/user/getById?id=${this.id}`)
        .subscribe((res: ResponseVo) => {
          this.i = res.response;
        });
    } else {
      this.i = {};
    }
  }
  save(value: any) {
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

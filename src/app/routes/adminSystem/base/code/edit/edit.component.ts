import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';

@Component({
  selector: 'app-code-edit',
  templateUrl: './edit.component.html',
})
export class CodeEditComponent implements OnInit {
  title = '添加码';
  id = this.route.snapshot.queryParams.id;
  i: any;
  schema: SFSchema = {
    properties: {
      type: { type: 'string', title: '类型', maxLength: 10 },
      name: { type: 'string', title: '码名', maxLength: 10 },
      value: { type: 'number', title: '码值', maximum: 10000 },
    },
    required: ['type', 'name', 'value'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 8 },
    },
    $type: {
      widget: 'string',
      grid: { span: 8 },
    },
    $name: {
      widget: 'string',
      grid: { span: 8 },
    },
    $value: {
      widget: 'number',
      grid: { span: 8 },
    },
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reuseTabService: ReuseTabService,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.id) {
      this.title = '编辑码';
      this.http.get(`/cfmy/code/getById?id=${this.id}`)
        .subscribe((res: ResponseVo) => {
          this.i = res.response;
        });
    } else {
      this.i = {};
    }
  }
  save(value: any) {
    if (this.id) {
      this.http.post(`/cfmy/code/update`, value).subscribe(res => {
        this.msgSrv.success('修改成功');
        this.back();
      });
    } else {
      this.http.post(`/cfmy/code/add`, value).subscribe(res => {
        this.msgSrv.success('添加成功');
        this.back();
      });
    }
  }
  back() {
    const parentUrl = '/admin/base/code';
    if (this.reuseTabService.exists(parentUrl)) {
      this.reuseTabService.replace(parentUrl);
    } else {
      this.router.navigateByUrl(parentUrl);
      setTimeout(() => {
        this.reuseTabService.close('/admin/base/code/edit');
      }, 100);
    }
  }
}

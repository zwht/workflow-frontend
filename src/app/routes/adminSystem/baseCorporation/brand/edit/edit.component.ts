/*
 * @Descripttion: 
 * @version: 
 * @Author: zhaowei
 * @Date: 2019-11-14 16:18:56
 * @LastEditors: zhaowei
 * @LastEditTime: 2019-11-14 17:06:29
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';
@Component({
  selector: 'app-brand-edit',
  templateUrl: './edit.component.html',
})
export class BrandEditComponent implements OnInit {
  @ViewChild('sf') sf: SFComponent;
  title = '添加';
  cpName = '工序';
  id;
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称', maxLength: 30 },
      describeWord: { type: 'string', title: '描述', maxLength: 200},
    },
    required: ['name', 'describeWord'],
  };
  brandGroupList = [];
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      width: 500,
      grid: { span: 24 },
    },
    $name: {
      widget: 'string',
    },
    $describeWord: {
      widget: 'string',
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
    this.getDetail();
  }
  _onReuseInit() {
    this.getDetail();
  }
  getDetail() {
    this.id = this.route.snapshot.queryParams.id;
    if (this.id) {
      this.title = '编辑';
      this.http.get(`./v1/brand/getById?id=${this.id}`)
        .subscribe((res: ResponseVo) => {
          this.i = res.response;
        });
    } else {
      this.i = {};
    }
  }
  save(value: any) {
    if (this.id) {
      this.http.post(`./v1/brand/update`, value).subscribe(res => {
        this.msgSrv.success('修改成功');
        this.back();
      });
    } else {
      this.http.post(`./v1/brand/add`, value).subscribe(res => {
        this.msgSrv.success('添加成功');
        this.back();
      });
    }
  }
  back() {
    const parentUrl = '/admin/baseCorporation/brand';
    if (this.reuseTabService.exists(parentUrl)) {
      this.reuseTabService.replace(parentUrl);
    } else {
      this.router.navigateByUrl(parentUrl);
      setTimeout(() => {
        this.reuseTabService.close('/admin/baseCorporation/brand/edit');
      }, 100);
    }
  }
}

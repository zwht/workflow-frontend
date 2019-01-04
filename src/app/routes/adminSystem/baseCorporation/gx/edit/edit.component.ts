import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';
@Component({
  selector: 'app-gx-edit',
  templateUrl: './edit.component.html',
})
export class GxEditComponent implements OnInit {
  @ViewChild('sf') sf: SFComponent;
  title = '添加';
  cpName = '工序';
  id;
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '工序名', maxLength: 30 },
      price: { type: 'number', title: '默认价格', maximum: 1000, minimum: 0 },
      indexKey: { type: 'number', title: '流程排序', maximum: 1000, minimum: 0 },
    },
    required: ['name', 'price', 'indexKey'],
  };
  gxGroupList = [];
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      width: 500,
      grid: { span: 24 },
    },
    $price: {
      widget: 'number',
    },
    $indexKey: {
      widget: 'number',
    },
    $name: {
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
      this.http.get(`./v1/gx/getById?id=${this.id}`)
        .subscribe((res: ResponseVo) => {
          this.i = res.response;
        });
    } else {
      this.i = {};
    }
  }
  save(value: any) {
    if (this.id) {
      this.http.post(`./v1/gx/update`, value).subscribe(res => {
        this.msgSrv.success('修改成功');
        this.back();
      });
    } else {
      this.http.post(`./v1/gx/add`, value).subscribe(res => {
        this.msgSrv.success('添加成功');
        this.back();
      });
    }
  }
  back() {
    const parentUrl = '/admin/baseCorporation/gx';
    if (this.reuseTabService.exists(parentUrl)) {
      this.reuseTabService.replace(parentUrl);
    } else {
      this.router.navigateByUrl(parentUrl);
      setTimeout(() => {
        this.reuseTabService.close('/admin/baseCorporation/gx/edit');
      }, 100);
    }
  }
}

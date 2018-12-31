import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';

@Component({
  selector: 'app-door-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.less'],
})
export class DoorEditComponent implements OnInit {
  @ViewChild('sf') sf: SFComponent;
  title = '添加';
  cpName = '产品';
  id = this.route.snapshot.queryParams.id;
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '门名', maxLength: 30 },
      number: { type: 'string', title: '编号', maxLength: 20, minimum: 2 },
    },
    required: ['name', 'number'],
  };
  doorGroupList = [];
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      width: 500,
      grid: { span: 24 },
    },
    $number: {
      widget: 'string',
    },
    $name: {
      widget: 'string',
    },
  };
  gxList = [];

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reuseTabService: ReuseTabService,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit(): void {
    if (this.id) {
      this.title = '编辑';
      this.http.get(`/cfmy/door/getById?id=${this.id}`)
        .subscribe((res: ResponseVo) => {
          this.i = res.response;
        });
    } else {
      this.i = {};
    }
    this.getGxList();
  }
  save(value: any) {
    if (this.id) {
      this.http.post(`/cfmy/door/update`, value).subscribe(res => {
        this.msgSrv.success('修改成功');
        this.back();
      });
    } else {
      this.http.post(`/cfmy/door/add`, value).subscribe(res => {
        this.msgSrv.success('添加成功');
        this.back();
      });
    }
  }
  back() {
    const parentUrl = '/admin/baseCorporation/door';
    if (this.reuseTabService.exists(parentUrl)) {
      this.reuseTabService.replace(parentUrl);
    } else {
      this.router.navigateByUrl(parentUrl);
      setTimeout(() => {
        this.reuseTabService.close('/admin/baseCorporation/door/edit');
      }, 100);
    }
  }
  getGxList() {
    this.http.post(`/cfmy/gx/list?pageNum=1&pageSize=1000`, {})
      .subscribe((res: ResponseVo) => {
        const hasKey = 12 - res.response.data.length % 12;
        for (let i = 0; i < hasKey; i++) {
          res.response.data.push({});
        }
        this.gxList = res.response.data;
      });
  }
}

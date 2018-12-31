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
  cpName = '门';
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

  cropperImg;
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
          this.cropperImg = this.i.img;
          this.getGxList();
        });
    } else {
      this.i = {};
      this.getGxList();
    }
  }
  save(value: any) {
    let gxIds = '', gxValues = '';
    this.gxList.forEach(item => {
      if (item.price) {
        gxIds += item.id + ',';
        gxValues += item.price + ',';
      }
    });
    gxIds = gxIds.substr(0, gxIds.length - 1);
    gxValues = gxValues.substr(0, gxValues.length - 1);
    const data = Object.assign({}, value,
      { img: this.cropperImg, gxIds, gxValues, type: 1301 });
    if (this.id) {
      this.http.post(`/cfmy/door/update`,
        data)
        .subscribe(res => {
          this.msgSrv.success('修改成功');
          this.back();
        });
    } else {
      this.http.post(`/cfmy/door/add`,
        data)
        .subscribe(res => {
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
        if (this.i.gxIds) {
          const gxIds = this.i.gxIds.split(','), gxValues = this.i.gxValues.split(',');
          res.response.data.forEach(item => {
            gxIds.forEach((obj, i) => {
              if (obj === item.id) {
                item.price = gxValues[i];
              }
            });
          });
        }
        const hasKey = 12 - res.response.data.length % 12;
        for (let i = 0; i < hasKey; i++) {
          res.response.data.push({});
        }
        this.gxList = res.response.data;
      });
  }
}

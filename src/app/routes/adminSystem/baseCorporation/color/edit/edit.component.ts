import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';

@Component({
  selector: 'app-color-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.less'],
})
export class ColorEditComponent implements OnInit {
  @ViewChild('sf') sf: SFComponent;
  title = '添加';
  cpName = '门';
  id = this.route.snapshot.queryParams.id;
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '颜色名', maxLength: 30 },
      value: { type: 'string', title: '颜色值', maxLength: 20, minimum: 2 },
    },
    required: ['name', 'value'],
  };
  colorGroupList = [];
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      width: 500,
      grid: { span: 24 },
    },
    $value: {
      widget: 'string',
    },
    $name: {
      widget: 'string',
    },
  };
  gxList = [];
  myGxList = [];
  selectGxModal;
  contextMenuKey;
  activeItem;
  modleGxL = [];

  cropperImg;
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  // 右键菜单
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reuseTabService: ReuseTabService,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private contextMenuService: ContextMenuService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit(): void {
    if (this.id) {
      this.title = '编辑';
      this.http.get(`./v1/color/getById?id=${this.id}`)
        .subscribe((res: ResponseVo) => {
          this.i = res.response;
          this.cropperImg = this.i.img;
        });
    } else {
      this.i = {};
    }
  }
  save(value: any) {
    const data = Object.assign({}, value,
      { img: this.cropperImg});
    if (this.id) {
      this.http.post(`./v1/color/update`,
        data)
        .subscribe(res => {
          this.msgSrv.success('修改成功');
          this.back();
        });
    } else {
      this.http.post(`./v1/color/add`,
        data)
        .subscribe(res => {
          this.msgSrv.success('添加成功');
          this.back();
        });
    }
  }
  back() {
    const parentUrl = '/admin/baseCorporation/color';
    if (this.reuseTabService.exists(parentUrl)) {
      this.reuseTabService.replace(parentUrl);
    } else {
      this.router.navigateByUrl(parentUrl);
      setTimeout(() => {
        this.reuseTabService.close('/admin/baseCorporation/color/edit');
      }, 100);
    }
  }
  del(event) {
    this.myGxList.forEach((item, index) => {
      if (item.id === event.item.id) {
        this.myGxList.splice(index, 1);
      }
    });
  }
}

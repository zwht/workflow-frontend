import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { SelectGxComponent } from '../../selectGx/selectGx.component';
import { map } from 'rxjs/operators';
import { ResponsePageVo } from '@interface/utils/ResponsePageVo';

@Component({
  selector: 'app-door-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.less'],
})
export class DoorEditComponent implements OnInit {
  @ViewChild('sf') sf: SFComponent;
  title = '添加';
  cpName = '型号';
  id = this.route.snapshot.queryParams.id;
  i: any = {
    type: 1301,
  };
  schema: SFSchema = {
    properties: {
      type: { type: 'number', title: '类型', maxLength: 20, minimum: 2 },
      name: { type: 'string', title: '门名', maxLength: 30 },
      number: { type: 'string', title: '编号', maxLength: 20, minimum: 2 },
    },
    required: ['name', 'number', 'type'],
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
    $type: {
      widget: 'select',
      asyncData: () => {
        return this.http
          .post(
            './v1/public/code/list',
            {
              groupId: '291996688304967680',
            },
            { pageNum: 1, pageSize: 1000 },
          )
          .pipe(
            map((item: ResponsePageVo) => {
              if (!item.response.data.length) return [];
              return item.response.data
                .filter(obi => {
                  return obi.name === '门套' || obi.name === '门';
                })
                .map(obj => {
                  return {
                    label: obj.name,
                    value: obj.value,
                  };
                });
            }),
          );
      },
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
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.title = '编辑';
      this.http
        .get(`./v1/door/getById?id=${this.id}`)
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
    let gxIds = '',
      gxValues = '';
    this.myGxList.forEach(item => {
      if (item.price) {
        gxIds += item.id + ',';
        gxValues += item.price + ',';
      }
    });
    gxIds = gxIds.substr(0, gxIds.length - 1);
    gxValues = gxValues.substr(0, gxValues.length - 1);
    const data = Object.assign({}, value, {
      img: this.cropperImg,
      gxIds,
      gxValues,
    });
    if (this.id) {
      this.http.post(`./v1/door/update`, data).subscribe(res => {
        this.msgSrv.success('修改成功');
        this.back();
      });
    } else {
      this.http.post(`./v1/door/add`, data).subscribe(res => {
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
    this.http
      .post(`./v1/gx/list?pageNum=1&pageSize=1000`, {})
      .subscribe((res: ResponseVo) => {
        if (this.i.gxIds) {
          const gxIds = this.i.gxIds.split(','),
            gxValues = this.i.gxValues.split(',');
          res.response.data.forEach(item => {
            gxIds.forEach((obj, i) => {
              if (obj === item.id) {
                item.price = gxValues[i];
                item.act = true;
              }
            });
          });
        } else {
          res.response.data.forEach(item => {
            item.act = true;
          });
        }
        this.gxList = res.response.data;
        const myGxList = Object.assign(
          [],
          this.gxList.filter(item => {
            return item.act;
          }),
        );
        const hasKey = 12 - (myGxList.length % 12);
        for (let i = 0; i < hasKey; i++) {
          myGxList.push({});
        }
        this.myGxList = myGxList;
      });
  }
  // 右键菜单触发
  onContextMenu($event: MouseEvent, item: any): void {
    this.modleGxL = this.gxList.filter(gx => {
      let key = true;
      this.myGxList.forEach(obj => {
        if (obj.id === gx.id) {
          key = false;
        }
      });
      return key;
    });
    if (!item || !item.id) {
      return;
    }
    setTimeout(() => {
      // 触发弹框
      this.contextMenuService.show.next({
        contextMenu: this.contextMenu,
        event: $event,
        item: item,
      });
    }, 100);
    $event.preventDefault();
    $event.stopPropagation();
  }
  // 右键菜单点击event={event:obj,item:obj}
  contextMenuClick(event: any, key: String) {
    this.contextMenuKey = key;
    this.myGxList.forEach((item, index) => {
      item.newIndex = index;
    });
    this.activeItem = event.item;
    switch (key) {
      case 'add1':
        this.createSelectGxModal();
        break;
      case 'add2':
        this.createSelectGxModal();
        break;
      case 'del':
        this.del(event);
        break;
      case 'show':
        break;
      default:
        break;
    }
  }
  del(event) {
    this.myGxList.forEach((item, index) => {
      if (item.id === event.item.id) {
        this.myGxList.splice(index, 1);
      }
    });
  }
  createSelectGxModal(): void {
    if (!this.modleGxL.length) {
      this.msgSrv.warning('已经添加全部工序');
      return;
    }
    const modal = this.modalService.create({
      nzTitle: '选择工序',
      nzWidth: 1200,
      nzContent: SelectGxComponent,
      nzComponentParams: {
        gxList: this.modleGxL,
      },
      nzFooter: null,
      // nzFooter: [{
      //   label: '确定',
      //   onClick: (componentInstance) => {
      //     componentInstance.title = 'title in inner component is changed';
      //   }
      // }]
    });
    // 打开后回调
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // 关闭回调
    modal.afterClose.subscribe(result => {
      if (result) {
        if (this.contextMenuKey === 'add1') {
          this.myGxList.splice(this.activeItem.newIndex, 0, result.data);
        }
        if (this.contextMenuKey === 'add2') {
          this.myGxList.splice(this.activeItem.newIndex + 1, 0, result.data);
        }
      }
    });
    // 推迟到模态实例创建
    // window.setTimeout(() => {
    //   const instance = modal.getContentComponent();
    // }, 2000);
  }
}

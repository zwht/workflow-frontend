import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { ENgxPrintComponent } from 'e-ngx-print';
import { ResponsePageVo } from '@interface/utils/ResponsePageVo';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { ProductObj } from './editClass';
import { SelectDoorComponent } from '../selectDoor/selectDoor.component';

@Component({
  selector: 'app-my-ticket-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.less'],
})
export class MyTicketEditComponent implements OnInit {
  @ViewChild('sf') sf: SFComponent;
  title = '添加';
  cpName = '工单';
  id = this.route.snapshot.queryParams.id;
  valid = false;
  loading = false;
  ticketId = '999';

  ticket = {};
  gxList = [];
  productList = [
    new ProductObj(this.ticketId)
  ];

  // 打印配
  showHead: Boolean = true;
  hideTable1: Boolean = false;
  printCSS: string[] = ['./assets/tmp/css/ticket.css'];
  printStyle: string;
  @ViewChild('printComponent') printComponent: ENgxPrintComponent;
  // 右键菜单
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;
  showDetilKey = '展开详情';

  item = {
    mark: '分开就分开就分开，速度加快艰苦奋斗是，史蒂夫健康科技时代'
  };

  inputValue: string;
  options = [];

  bingName = '测试';

  onInput(value: string): void {
    this.options = value ? [
      value,
      value + value,
      value + value + value
    ] : [];
  }
  constructor(
    private elRef: ElementRef,
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
    this.getGxList();
    if (this.id) {
      this.title = '编辑';

    }
  }
  // 右键菜单触发
  onContextMenu($event: MouseEvent, item: any): void {
    // 实在显示／隐藏详情菜单
    this.showDetilKey = item.show ? '隐藏详情' : '展开详情';
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.contextMenu,
      event: $event,
      item: item,
    });
    $event.preventDefault();
    $event.stopPropagation();
  }
  // 右键菜单点击
  contextMenuClick(event: any, key: String) {
    switch (key) {
      case 'add':
        this.productList.forEach((item, i) => {
          if (item.id === event.item.id) {
            this.productList.splice(i + 1, 0, new ProductObj(this.ticketId));
          }
        });
        break;
      case 'copy':
        this.productList.forEach((item, i) => {
          if (item.id === event.item.id) {
            this.productList.splice(i + 1, 0, event.item.copy());
          }
        });
        break;
      case 'del':
        this.productList = this.productList.filter(item => {
          if (item.id === event.item.id) {
            return false;
          } else {
            return true;
          }
        });
        break;
      case 'show':
        event.item.show = !event.item.show;
        break;
      default:
        break;
    }
  }
  save(value: any) {
    if (this.id) {
      this.http.post(`./v1/ticket/update`,
        value)
        .subscribe(res => {
          this.msgSrv.success('修改成功');
          this.back();
        });
    } else {
      this.http.post(`./v1/ticket/add`,
        value)
        .subscribe(res => {
          this.msgSrv.success('添加成功');
          this.back();
        });
    }
  }
  back() {
    const parentUrl = '/admin/ticket/myTicket';
    if (this.reuseTabService.exists(parentUrl)) {
      this.reuseTabService.replace(parentUrl);
    } else {
      this.router.navigateByUrl(parentUrl);
      setTimeout(() => {
        this.reuseTabService.close('/admin/ticket/myTicket/edit');
      }, 100);
    }
  }
  getGxList() {
    this.http.post(`./v1/gx/list?pageNum=1&pageSize=1000`, {})
      .subscribe((res: ResponsePageVo) => {
        if (res.status === 200) {

          const hasKey = 12 - res.response.data.length % 12;
          for (let i = 0; i < hasKey; i++) {
            res.response.data.push({});
          }
          this.gxList = res.response.data;
        }
      });
  }

  showDoor(item) {
    const modal = this.modalService.create({
      nzTitle: '选择型号',
      nzWidth: 1200,
      nzContent: SelectDoorComponent,
      nzComponentParams: {
        gxList: this.gxList,
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
    modal.afterClose.subscribe((result) => {
      if (result) {
        item.doorObj = result.data;
      }
    });
    // 推迟到模态实例创建
    // window.setTimeout(() => {
    //   const instance = modal.getContentComponent();
    // }, 2000);
  }

  printComplete() {
    console.log('打印完成！');
    this.showHead = true;
    this.hideTable1 = false;
  }

  print() {
    this.showHead = false;
    this.hideTable1 = true;
    this.printComponent.print();
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { ENgxPrintComponent } from 'e-ngx-print';
import { ResponsePageVo } from '@interface/utils/ResponsePageVo';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { ProductObj } from './editClass';
import { SelectDoorComponent } from '../selectDoor/selectDoor.component';
import { SelectColorComponent } from '../selectColor/selectColor.component';
import { SelectMaterialComponent } from '../selectMaterial/selectMaterial.component';
import { container } from '@angular/core/src/render3';

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
  contextMenuActive: ProductObj = new ProductObj(this.ticketId);
  ticket = {};
  gxList = [];
  productList = [
    new ProductObj(this.ticketId)
  ];
  ticketObj = {
    createTime: new Date(),
    startTime: null,
    endTime: null,
    createUserName: this.settings.user.name,
    brandId: '',
    dealersId: '',
    marketId: '',
    number: 0,
    sumDoor: 0,
    sumTaoban: 0,
    sumWindow: 0,
    sumLine: 0,
  };
  dealersList = [];
  marketList = [];
  brandList = [
    {
      id: 1,
      name: '重庆川峰门业',
    },
    {
      id: 2,
      name: '重庆御驰门业',
    }
  ];

  // 打印配
  showHead: Boolean = true;
  hideTable1: Boolean = false;
  printCSS: string[] = ['./assets/tmp/css/ticket.css'];
  printStyle: string;
  @ViewChild('printComponent') printComponent: ENgxPrintComponent;
  // 右键菜单
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;
  showDetilName = '展开详情';
  mergeKey = true;
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
    public settings: SettingsService,
  ) {
  }
  ngOnInit(): void {
    this.getGxList();
    if (this.id) {
      this.title = '编辑';
    }
    this.getUser();
  }
  // 右键菜单触发
  onContextMenu($event: MouseEvent, item: any): void {
    // 实在显示／隐藏详情菜单
    this.showDetilName = item.show ? '隐藏详情' : '展开详情';
    this.contextMenuActive = item;
    setTimeout(() => {
      this.contextMenuService.show.next({
        // Optional - if unspecified, all context menu components will open
        contextMenu: this.contextMenu,
        event: $event,
        item: item,
      });
    }, 100);
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
        this.totalFn();
        this.setProductList();
        break;
      case 'copy':
        this.productList.forEach((item, i) => {
          if (item.id === event.item.id) {
            this.productList.splice(i + 1, 0, event.item.copy());
          }
        });
        this.totalFn();
        this.setProductList();
        break;
      case 'del':
        this.productList = this.productList.filter(item => {
          if (item.id === event.item.id) {
            return false;
          } else {
            return true;
          }
        });
        this.totalFn();
        this.setProductList();
        break;
      case 'show':
        event.item.show = !event.item.show;
        this.setProductList();
        break;
      case 'merge':
        this.mergeKey = !this.mergeKey;
        this.setProductList();
        break;
      case 'up':
        [this.productList[this.contextMenuActive.index], this.productList[this.contextMenuActive.index - 1]] =
          [this.productList[this.contextMenuActive.index - 1], this.productList[this.contextMenuActive.index]];
        this.setProductList();
        break;
      case 'down':
        [this.productList[this.contextMenuActive.index], this.productList[this.contextMenuActive.index + 1]] =
          [this.productList[this.contextMenuActive.index + 1], this.productList[this.contextMenuActive.index]];
        this.setProductList();
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
        let active = -1;
        if (item.rowspanDoor !== 1) {
          this.productList.forEach((it, i) => {
            if (it === item) {
              active = i;
            } else if (it.rowspanDoorParent === active) {
              it.doorObj = result.data;
            } else {
              active = -1;
            }
          });
        }
        item.doorObj = result.data;
        if (result.data.type === 1302) {
          item.doorSize = '';
        }
        this.setProductList();
      }
    });
    // 推迟到模态实例创建
    // window.setTimeout(() => {
    //   const instance = modal.getContentComponent();
    // }, 2000);
  }

  showColor(item) {
    const modal = this.modalService.create({
      nzTitle: '选择颜色',
      nzWidth: 1200,
      nzContent: SelectColorComponent,
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
        let active = -1;
        if (item.rowspanColor !== 1) {
          this.productList.forEach((it, i) => {
            if (it === item) {
              active = i;
            } else if (it.rowspanColorParent === active) {
              it.color = result.data.name;
            } else {
              active = -1;
            }
          });
        }
        item.color = result.data.name;
        this.setProductList();
      }
    });
    // 推迟到模态实例创建
    // window.setTimeout(() => {
    //   const instance = modal.getContentComponent();
    // }, 2000);
  }

  showMaterial(item) {
    const modal = this.modalService.create({
      nzTitle: '选择材质',
      nzWidth: 1200,
      nzContent: SelectMaterialComponent,
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
        let active = -1;
        if (item.rowspanMaterial !== 1) {
          this.productList.forEach((it, i) => {
            if (it === item) {
              active = i;
            } else if (it.rowspanMaterialParent === active) {
              it.material = result.data.name;
            } else {
              active = -1;
            }
          });
        }
        item.material = result.data.name;
        this.setProductList();
      }
    });
    // 推迟到模态实例创建
    // window.setTimeout(() => {
    //   const instance = modal.getContentComponent();
    // }, 2000);
  }

  setProductList() {
    for (let i = 0; i < this.productList.length; i++) {
      this.productList[i].index = i;
      this.setItemGxPrice(this.productList[i]);
    }

    for (let i = 0; i < this.productList.length; i++) {
      this.productList[i].rowspanDoor = 1;
      if (this.productList[i].show) {
        this.productList[i].rowspanDoor++;
      }
      this.productList[i].rowspanDoorParent = null;
      if (this.productList[i].doorObj.id && this.mergeKey) {
        for (let j = i + 1; j < this.productList.length; j++) {
          if (this.productList[i].doorObj.id === this.productList[j].doorObj.id) {
            this.productList[i].rowspanDoor++;
            if (this.productList[j].show) {
              this.productList[i].rowspanDoor++;
            }
            this.productList[j].rowspanDoor = 0;
            this.productList[j].rowspanDoorParent = i;
          } else {
            i = j - 1;
            break;
          }
          if (j === this.productList.length - 1) {
            i = j;
          }
        }
      }
    }

    for (let i = 0; i < this.productList.length; i++) {
      this.productList[i].rowspanMaterial = 1;
      if (this.productList[i].show) {
        this.productList[i].rowspanMaterial++;
      }
      this.productList[i].rowspanMaterialParent = null;
      if (this.productList[i].material && this.mergeKey) {
        for (let j = i + 1; j < this.productList.length; j++) {
          if (this.productList[i].material === this.productList[j].material) {
            this.productList[i].rowspanMaterial++;
            if (this.productList[j].show) {
              this.productList[i].rowspanMaterial++;
            }
            this.productList[j].rowspanMaterial = 0;
            this.productList[j].rowspanMaterialParent = i;
          } else {
            i = j - 1;
            break;
          }
          if (j === this.productList.length - 1) {
            i = j;
          }
        }
      }
    }

    for (let i = 0; i < this.productList.length; i++) {
      this.productList[i].rowspanColor = 1;
      if (this.productList[i].show) {
        this.productList[i].rowspanColor++;
      }
      this.productList[i].rowspanColorParent = null;
      if (this.productList[i].color && this.mergeKey) {
        for (let j = i + 1; j < this.productList.length; j++) {
          if (this.productList[i].color === this.productList[j].color) {
            this.productList[i].rowspanColor++;
            if (this.productList[j].show) {
              this.productList[i].rowspanColor++;
            }
            this.productList[j].rowspanColor = 0;
            this.productList[j].rowspanColorParent = i;
          } else {
            i = j - 1;
            break;
          }
          if (j === this.productList.length - 1) {
            i = j;
          }
        }
      }
    }
  }

  // 计算单个产品价格
  setItemGxPrice(item) {
    let sum = 0;
    if (item.doorSize !== '') {
      sum += parseInt(item.doorSize.split('=')[1], 10) || 0;
    }
    let dblbSum = 0;
    if (item.lbSize) {
      dblbSum += parseInt(item.lbSize.split('=')[1], 10) || 0;
    }
    if (item.dbSize) {
      dblbSum += parseInt(item.dbSize.split('=')[1], 10) || 0;
    }
    if (dblbSum) {
      sum += dblbSum / 6;
    }
    item.doorObj.gxList.forEach(obj => {
      obj.countPrice = Math.floor(parseFloat(obj.price) * sum * item.sum * 100) / 100;
    });
  }

  // 失去焦点处理
  onBlur(event, item, key) {
    let a = true;
    switch (key) {
      case 'doorSize':
        if (item[key]) {
          a = /^[1-9][0-9]{2,3}\*[1-9][0-9]{1,3}\=[1-9]{1}$/.test(item[key]);
        }
        break;
      case 'lbSize':
        a = /^[1-9][0-9]{2,3}\*[1-9][0-9]{1,2}\=[1-9][0-9]{0,1}$/.test(item[key]);
        break;
      case 'dbSize':
        a = /^[1-9][0-9]{1,3}\*[1-9][0-9]{1,2}\=[1-9][0-9]{0,1}$/.test(item[key]);
        break;
      case 'coverSize':
        a = /^[1-9][0-9]{2,3}\*[1-9][0-9]{1,3}\*[1-9][0-9]{1,2}$/.test(item[key]);
        break;
      case 'sum':
        a = /^[1-9][0-9]{0,1}$/.test(item[key]);
        break;
      default:
        break;
    }
    if (!a) {
      event.target.style.background = 'rgba(255,0,0,0.2)';
    } else {
      this.setItemGxPrice(item);
      event.target.style.background = 'none';
    }
    this.totalFn();
  }

  // 总计方法
  totalFn() {
    setTimeout(() => {
      this.ticketObj.sumDoor = 0;
      this.ticketObj.sumTaoban = 0;
      this.ticketObj.sumWindow = 0;

      this.productList.forEach(item => {
        if (item.doorSize) {
          this.ticketObj.sumDoor += item.sum * parseInt(item.doorSize.split('=')[1], 10);
          this.ticketObj.sumTaoban += item.sum * (parseInt(item.lbSize.split('=')[1], 10) + parseInt(item.dbSize.split('=')[1], 10));
        } else {
          this.ticketObj.sumWindow += item.sum * (parseInt(item.lbSize.split('=')[1], 10) + parseInt(item.dbSize.split('=')[1], 10));
        }
      });
    }, 100);
  }

  createTimeDisabled = (current: Date): boolean => {
    if (this.ticketObj.startTime) {
      return current.getTime() > new Date(this.ticketObj.startTime).getTime();
    } else {
      return false;
    }
  }

  startTimeDisabled = (current: Date): boolean => {
    if (this.ticketObj.endTime) {
      return current.getTime() > new Date(this.ticketObj.endTime).getTime() ||
        current.getTime() < new Date(this.ticketObj.createTime).getTime();
    } else {
      return false;
    }
  }

  endTimeDisabled = (current: Date): boolean => {
    if (this.ticketObj.startTime) {
      return current.getTime() < new Date(this.ticketObj.startTime).getTime();
    } else {
      return false;
    }
  }

  getUser() {
    this.http.post(`./v1/user/list?pageNum=1&pageSize=10000`, {
      roles: '101'
    })
      .subscribe((res: ResponsePageVo) => {
        this.marketList = res.response.data;
      });
    this.http.post(`./v1/user/list?pageNum=1&pageSize=10000`, {
      roles: '102'
    })
      .subscribe((res: ResponsePageVo) => {
        this.dealersList = res.response.data;
      });
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

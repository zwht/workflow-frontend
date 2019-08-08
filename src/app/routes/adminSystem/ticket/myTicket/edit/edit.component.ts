import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NzMessageService,
  NzModalService,
  NzNotificationService,
} from 'ng-zorro-antd';
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

@Component({
  selector: 'app-my-ticket-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.less'],
})
export class MyTicketEditComponent implements OnInit {
  @ViewChild('sf') sf: SFComponent;
  printObj1 = {
    key: 1,
    title: '川峰木门工单',
    tr: 29 + 3,
    codeCol: 4 + 3,
    zjCol: 27 + 3,
    tdWdith: '3.125%',
  };
  printObj2 = {
    key: 2,
    title: '川峰木门生产流程单',
    tr: 29,
    codeCol: 4,
    zjCol: 27,
    tdWdith: '3.448%',
  };
  printObj3 = {
    key: 3,
    title: '川峰木门销售回传单',
    tr: 29,
    codeCol: 4,
    zjCol: 27,
    tdWdith: '3.448%',
  };
  backDescribe = [
    {
      n: '',
      url: '',
    },
    {
      n: '',
      url: '',
    },
    {
      n: '',
      url: '',
    },
    {
      n: '',
      url: '',
    },
  ];
  printObj = this.printObj1;
  title = '添加';
  cpName = '工单';
  id = this.route.snapshot.queryParams.id;
  valid = false;
  loading = false;
  contextMenuActive: ProductObj = new ProductObj(this.id);
  ticket = {};
  gxList = [];
  productList = [];
  lines = [
    {
      name: '2200',
    },
    {
      name: '2400',
    },
    {
      name: '2700',
    },
    {
      name: '3000',
    },
  ];
  ticketObj = {
    pay: null,
    earnest: '',
    payment: 0,
    backDescribe: '',
    name: '',
    createTime: new Date(),
    startTime: null,
    endTime: null,
    editName: this.settings.user.name,
    editId: this.settings.user.id,
    brandId: '',
    dealersId: '',
    marketId: '',
    address: '',
    number: '',
    sumDoor: 0,
    sumTaoban: 0,
    sumWindow: 0,
    sumLine: 0,
    sumLine22: 0,
    sumLine24: 0,
    sumLine27: 0,
    sumLine30: 0,
    remarks: '',
    summary: '',
    state: null,
    lines: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
  };
  dealersList = [];
  marketList = [];
  brandList = [
    {
      id: '1',
      name: '重庆川峰门业',
    },
    {
      id: '2',
      name: '重庆御驰门业',
    },
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

  inputValue: string;
  options = [];

  baseTdList = [];

  onInput(value: string): void {
    this.options = value ? [value, value + value, value + value + value] : [];
  }
  constructor(
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private reuseTabService: ReuseTabService,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private contextMenuService: ContextMenuService,
    private modalService: NzModalService,
    public settings: SettingsService,
    private settingsService: SettingsService,
  ) {}
  ngOnInit(): void {
    this.getGxList();
    this.getUser();
    this.setTrSum();
  }
  setTrSum() {
    const ar = [];
    for (let i = 1; i <= this.printObj.tr; i++) {
      ar.push(i);
    }
    this.baseTdList = ar;
  }
  getDetails() {
    this.http
      .get(`./v1/ticket/getById?id=${this.id}`)
      .subscribe((res: ResponseVo) => {
        this.ticketObj = Object.assign(this.ticketObj, res.response);
        if (this.ticketObj.backDescribe) {
          this.backDescribe = JSON.parse(this.ticketObj.backDescribe);
        }
        if (
          this.settingsService.user.roles.indexOf('100') === -1 &&
          (this.ticketObj.state === 1503 || this.ticketObj.state > 1505)
        ) {
          this.valid = true;
        }
      });
    this.http
      .post(`./v1/product/list?pageNum=1&pageSize=100`, {
        ticketId: this.id,
      })
      .subscribe((res: ResponsePageVo) => {
        res.response.data.forEach(item => {
          item['doorObj'] = JSON.parse(item.door);
          item['colorObj'] = JSON.parse(item.color);
          item['materialObj'] = JSON.parse(item.material);
          item['lines'] = JSON.parse(item.line);
          this.setItemGxPrice(item);
        });
        this.productList = res.response.data.map(item => {
          return new ProductObj(item);
        });

        this.setProductList();
        this.totalFn();
        this.countLine();
        this.loading = false;
      });
    this.http
      .post(`./v1/process/list?pageNum=1&pageSize=100`, {
        ticketId: this.id,
      })
      .subscribe((res: ResponsePageVo) => {
        const ar = JSON.parse(JSON.stringify(this.gxList));
        res.response.data.forEach(item => {
          ar.forEach(obj => {
            if (obj.id === item.gxId) {
              item.price = parseFloat(item.price);
              item.priceAdd = parseFloat(item.priceAdd);
              obj.processId = item.id;
              obj.countPrice = item.price + item.priceAdd;
              obj.priceAdd = item.priceAdd;
              obj.state = item.state;
              obj.price = item.price;
              obj.userName = item.userName;
              obj.userId = item.userId;
            }
          });
        });
        this.gxList = [];
        this.gxList = ar;
        this.loading = false;
      });
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
            this.productList.splice(i + 1, 0, new ProductObj(this.id));
          }
        });
        this.totalFn();
        this.countLine();
        this.setTotalPrice();
        this.setProductList();
        break;
      case 'copy':
        this.productList.forEach((item, i) => {
          if (item.id === event.item.id) {
            this.productList.splice(i + 1, 0, event.item.copy());
          }
        });
        this.totalFn();
        this.countLine();
        this.setTotalPrice();
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
        this.countLine();
        this.setTotalPrice();
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
        [
          this.productList[this.contextMenuActive.indexKey],
          this.productList[this.contextMenuActive.indexKey - 1],
        ] = [
          this.productList[this.contextMenuActive.indexKey - 1],
          this.productList[this.contextMenuActive.indexKey],
        ];
        this.setProductList();
        break;
      case 'down':
        [
          this.productList[this.contextMenuActive.indexKey],
          this.productList[this.contextMenuActive.indexKey + 1],
        ] = [
          this.productList[this.contextMenuActive.indexKey + 1],
          this.productList[this.contextMenuActive.indexKey],
        ];
        this.setProductList();
        break;
      default:
        break;
    }
  }
  save() {
    this.loading = true;
    this.ticketObj.name = this.ticketObj.number;
    this.ticketObj.backDescribe = JSON.stringify(this.backDescribe);
    if (this.id) {
      this.http.post(`./v1/ticket/update`, this.ticketObj).subscribe(res => {
        this.msgSrv.success('修改成功');
        this.saveProduct();
      });
    } else {
      this.http
        .post(`./v1/ticket/add`, this.ticketObj)
        .subscribe((res: ResponseVo) => {
          this.id = res.response;
          this.router.navigate([this.router.url.split('/edit')[0] + '/edit'], {
            queryParams: { id: this.id },
          });
          this.saveProduct();
        });
    }
  }
  saveProduct() {
    this.productList.forEach(item => {
      item.ticketId = this.id;
      item['door'] = JSON.stringify(item.doorObj);
      item['color'] = JSON.stringify(item.colorObj);
      item['material'] = JSON.stringify(item.materialObj);
      item['line'] = JSON.stringify(item.lines);
      item.sum = parseInt(item.sum, 10);
    });
    this.http.post(`./v1/product/add`, this.productList).subscribe(res => {
      this.msgSrv.success('添加成功');
      this.saveProcess();
    });
  }
  userProcessChange(e, item) {
    this.http
      .post(`./v1/process/update`, {
        id: item.processId,
        state: 1602,
        userId: e,
        updateTime: new Date(),
      })
      .subscribe(res => {
        this.msgSrv.success('修改成功');
      });
  }
  saveProcess() {
    const gxAr = [];
    this.gxList.forEach((item, i) => {
      if (item.id) {
        gxAr.push({
          id: item.processId,
          gxId: item.id,
          price: item.price,
          priceAdd: item.countPrice - item.price,
          indexKey: i,
          ticketId: this.id,
          // userId: item.userId ? item.userId : '8',
          // state: item.userId && item.userId !== '8' ? 1602 : 1601,
        });
      }
    });
    this.http.post(`./v1/process/add`, gxAr).subscribe(res => {
      this.msgSrv.success('添加成功');
      this.getDetails();
    });
  }

  back() {
    const parentUrl = this.router.url.split('/edit')[0];
    if (this.reuseTabService.exists(parentUrl)) {
      this.reuseTabService.replace(parentUrl);
    } else {
      this.router.navigateByUrl(parentUrl);
      setTimeout(() => {
        this.reuseTabService.close(this.router.url);
      }, 100);
    }
  }
  getGxList() {
    this.http
      .post(`./v1/gx/list?pageNum=1&pageSize=1000`, {})
      .subscribe((res: ResponsePageVo) => {
        if (res.status === 200) {
          const hasKey = 12 - (res.response.data.length % 12);
          for (let i = 0; i < hasKey; i++) {
            res.response.data.push({});
          }
          res.response.data = res.response.data.map(oo => {
            oo.price = 0;
            if (!oo.userLis) {
              oo.userLis = [];
            }
            return oo;
          });
          this.http
            .post(`./v1/user/list?pageNum=1&pageSize=10000`, {
              roles: '106',
            })
            .subscribe((res1: ResponsePageVo) => {
              res1.response.data.forEach(obj => {
                if (obj.gxIds) {
                  obj.gxIds = JSON.parse(obj.gxIds);
                  res.response.data.forEach(item => {
                    if (obj.gxIds.indexOf(item.id) !== -1) {
                      item.userLis.push(obj);
                    }
                  });
                }
              });
              this.gxList = res.response.data;
              if (this.id) {
                this.title = '编辑';
                this.getDetails();
              } else {
                this.bianHao();
                this.productList = [new ProductObj(this.id)];
              }
            });
        }
      });
  }
  // 计算一个订单编号
  bianHao() {
    this.http.post(`./v1/ticket/count`, {}).subscribe((res: ResponsePageVo) => {
      if (res.status === 200) {
        const n = new Date();
        let year = n.getFullYear() + '';
        let month: any = n.getMonth() + 1;
        year = year.substring(year.length - 2);
        if (month < 10) {
          month = '0' + month;
        }
        this.ticketObj.number =
          year + month + '-' + (parseInt(res.response.pageCount, 10) + 1);
      }
    });
  }

  showDoor(item) {
    const modal = this.modalService.create({
      nzTitle: '选择型号',
      nzWidth: 1200,
      nzContent: SelectDoorComponent,
      nzMaskClosable: false,
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
    modal.afterClose.subscribe(result => {
      if (result) {
        let active = -1;
        if (item.rowspanDoor !== 1) {
          this.productList.forEach((it, i) => {
            if (it === item) {
              active = i;
            } else if (it.rowspanDoorParent === active) {
              it.doorObj = result.data;
              this.jsDoorSize(it);
              this.setItemGxPrice(it);
            } else {
              active = -1;
            }
          });
        }
        item.doorObj = result.data;
        item.unitPrice = result.data.unitPrice;
        item.unit = result.data.unit;
        if (result.data.type === 1302) {
          item.doorSize = '';
        }
        this.setProductList();
        this.jsDoorSize(item);
        this.setItemGxPrice(item);
        this.totalFn();
        this.jsMoney(item);
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
    modal.afterClose.subscribe(result => {
      if (result) {
        let active = -1;
        if (item.rowspanColor !== 1) {
          this.productList.forEach((it, i) => {
            if (it === item) {
              active = i;
            } else if (it.rowspanColorParent === active) {
              it.colorObj = result.data;
              this.setItemGxPrice(it);
            } else {
              active = -1;
            }
          });
        }
        item.colorObj = result.data;
        this.setProductList();
        this.setItemGxPrice(item);
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
    modal.afterClose.subscribe(result => {
      if (result) {
        let active = -1;
        if (item.rowspanMaterial !== 1) {
          this.productList.forEach((it, i) => {
            if (it === item) {
              active = i;
            } else if (it.rowspanMaterialParent === active) {
              it.materialObj = result.data;
              this.setItemGxPrice(it);
            } else {
              active = -1;
            }
          });
        }
        item.materialObj = result.data;
        this.setProductList();
        this.setItemGxPrice(item);
      }
    });
    // 推迟到模态实例创建
    // window.setTimeout(() => {
    //   const instance = modal.getContentComponent();
    // }, 2000);
  }

  // 设置产品列表合并单元格情况
  setProductList() {
    for (let i = 0; i < this.productList.length; i++) {
      this.productList[i].indexKey = i;
    }

    for (let i = 0; i < this.productList.length; i++) {
      this.productList[i].rowspanDoor = 1;
      if (this.productList[i].show) {
        this.productList[i].rowspanDoor++;
      }
      this.productList[i].rowspanDoorParent = null;
      if (this.productList[i].doorObj.id && this.mergeKey) {
        for (let j = i + 1; j < this.productList.length; j++) {
          if (
            this.productList[i].doorObj.id === this.productList[j].doorObj.id
          ) {
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
      if (this.productList[i].materialObj.id && this.mergeKey) {
        for (let j = i + 1; j < this.productList.length; j++) {
          if (
            this.productList[i].materialObj.id ===
            this.productList[j].materialObj.id
          ) {
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
      if (this.productList[i].colorObj.id && this.mergeKey) {
        for (let j = i + 1; j < this.productList.length; j++) {
          if (
            this.productList[i].colorObj.id === this.productList[j].colorObj.id
          ) {
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
    if (!item.doorObj.id) return;
    if (item.doorObj.type === 1301) {
      // 门扇1/2
      if (item.doorSize) {
        const doorSum = parseInt(item.doorSize.split('=')[1], 10);
        if (doorSum) {
          sum += doorSum / 2;
        }
      }
    }

    // 门套3块1/2,5块为1，4块为1/2
    let dblbSum = 0;
    if (item.lbSize) {
      dblbSum += parseInt(item.lbSize.split('=')[1], 10) || 0;
    }
    if (item.dbSize) {
      dblbSum += parseInt(item.dbSize.split('=')[1], 10) || 0;
    }
    if (dblbSum) {
      sum +=
        0.5 * (parseInt(dblbSum / 3 + '', 10) + (dblbSum % 3 === 2 ? 1 : 0));
    }
    if (item.doorObj.type === 1302) {
      sum = sum * 2;
    }
    // 根据型号计算价格
    const gxList = JSON.parse(JSON.stringify(item.doorObj.gxList)) || [];
    gxList.forEach(obj => {
      obj.countPrice =
        Math.floor(parseFloat(obj.price) * sum * item.sum * 100) / 100;
    });

    // 根据颜色计算价格
    item.colorObj.gxList.forEach(obj => {
      obj.countPrice =
        Math.floor(parseFloat(obj.price) * sum * item.sum * 100) / 100;
    });

    // 根据材质计算价格
    item.materialObj.gxList.forEach(obj => {
      obj.countPrice =
        Math.floor(parseFloat(obj.price) * sum * item.sum * 100) / 100;
    });

    item.colorObj.gxList.forEach(ob => {
      let k = true;
      gxList.forEach(obj => {
        if (ob.name === obj.name) {
          k = false;
          obj.countPrice += ob.countPrice;
        }
      });
      if (k) {
        gxList.push(ob);
      }
    });

    item.materialObj.gxList.forEach(ob => {
      let k = true;
      gxList.forEach(obj => {
        if (ob.name === obj.name) {
          k = false;
          obj.countPrice += ob.countPrice;
        }
      });
      if (k) {
        gxList.push(ob);
      }
    });
    item.gxList = gxList;
    this.setTotalPrice();
  }

  // 计算总价格
  setTotalPrice() {
    const gxList = JSON.parse(JSON.stringify(this.gxList));
    gxList.forEach(tGx => {
      tGx.countPrice = 0;
    });
    this.productList.forEach(item => {
      if (item.gxList.length) {
        item.gxList.forEach(itemGx => {
          gxList.forEach(tGx => {
            if (tGx.name === itemGx.name) {
              tGx.countPrice += itemGx.countPrice;
            }
          });
        });
      }
    });
    gxList.forEach(tGx => {
      tGx.price = tGx.countPrice;
      if (tGx.priceAdd) {
        tGx.countPrice += tGx.priceAdd;
      }
    });
    this.gxList = gxList;
  }

  // 总工序价格修改
  gxBlur(event, item) {
    if (item.countPrice && item.price !== item.countPrice) {
      item.priceAdd = item.countPrice - item.price;
    } else if (item.price === item.countPrice) {
      item.priceAdd = 0;
    }
  }

  // 失去焦点处理
  onBlur(event, item, key, i?) {
    let a = true;
    switch (key) {
      case 'doorSize':
        a = /^[1-9][0-9]{2,3}\*[1-9][0-9]{1,3}\=[1-9]{1}$/.test(item[key]);
        break;
      case 'lbSize':
        a = /^[1-9][0-9]{2,3}\*[1-9][0-9]{1,2}\=[1-9][0-9]{0,1}$/.test(
          item[key],
        );
        break;
      case 'dbSize':
        a = /^[1-9][0-9]{1,3}\*[1-9][0-9]{1,2}\=[1-9][0-9]{0,1}$/.test(
          item[key],
        );
        break;
      case 'coverSize':
        // 洞口尺寸
        a = /^[1-9][0-9]{2,3}\*[1-9][0-9]{1,3}\*[1-9][0-9]{1,2}$/.test(
          item[key],
        );
        this.jsDoorSize(item);
        break;
      case 'sum':
        a = /^[1-9][0-9]*([.][0-9]+)?$/.test(item[key]);
        if (a) this.jsMoney(item);
        break;
      case 'lines':
        if (item[key][i].value !== '') {
          a = /^[1-9][0-9]{0,1}$/.test(item[key][i].value);
        }
        // setTimeout(() => {
        //   this.summaryFn();
        // }, 100);
        break;
      case 'unitPrice':
        // 单价
        a = /^[1-9][0-9]*([.][0-9]+)?$/.test(item[key]);
        if (a) this.jsMoney(item);
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
    this.countLine();
  }

  // 自动计算价格
  jsMoney(item) {
    if (item.sum && item.unitPrice) {
      item.money = parseFloat(item.sum) * parseFloat(item.unitPrice);
      let pay = 0;
      this.productList.forEach(obj => {
        pay += parseFloat(obj.money);
      });
      this.ticketObj.pay = parseFloat(pay.toFixed(2));
    } else {
      item.money = null;
    }
  }

  // 自动计算门尺寸
  jsDoorSize(item) {
    // 判断是否有型号，计算根据型号配置来的
    if (!item.doorObj.id) return;
    // 判断洞口尺寸是否标准
    const a = /^[1-9][0-9]{2,3}\*[1-9][0-9]{1,3}\*[1-9][0-9]{1,2}$/.test(
      item.coverSize,
    );
    if (!a) return;

    const hwd = item.coverSize.split('*');
    const h = parseInt(hwd[0], 10),
      w = parseInt(hwd[1], 10),
      d = parseInt(hwd[2], 10);
    let msH = 0,
      msW = 0,
      lbH = 0,
      lbW = 0,
      dbH = 0,
      dbW = 0;

    lbH = eval(item.doorObj.arithmetic.lbH);
    lbW = eval(item.doorObj.arithmetic.lbW);
    dbH = eval(item.doorObj.arithmetic.dbH);
    dbW = eval(item.doorObj.arithmetic.dbW);

    // 类型为门的时候计算门板
    if (item.doorObj.type === 1301) {
      msH = eval(item.doorObj.arithmetic.msH);
      msW = eval(item.doorObj.arithmetic.msW);
      item.doorSize = msH + '*' + msW + '=1';
    }

    item.lbSize = lbH + '*' + lbW + '=2';
    item.dbSize = dbH + '*' + dbW + '=1';
    this.notification.create(
      'warning',
      '请注意！',
      '门扇，立板，顶板已自动计算，请注意是否需要修改！',
    );
  }

  // 总计方法
  totalFn() {
    setTimeout(() => {
      this.ticketObj.sumDoor = 0;
      this.ticketObj.sumTaoban = 0;
      this.ticketObj.sumWindow = 0;
      this.productList.forEach(item => {
        if (item.doorObj.id) {
          if (item.doorObj.type === 1302) {
            this.ticketObj.sumDoor += item.sum / 2;
          } else {
            this.ticketObj.sumDoor += item.sum;
          }
          if (item.doorObj['type'] === 1301) {
            this.ticketObj.sumTaoban +=
              item.sum *
              ((item.lbSize ? parseInt(item.lbSize.split('=')[1], 10) : 0) +
                (item.dbSize ? parseInt(item.dbSize.split('=')[1], 10) : 0));
          } else {
            this.ticketObj.sumWindow +=
              item.sum *
              ((item.lbSize ? parseInt(item.lbSize.split('=')[1], 10) : 0) +
                (item.dbSize ? parseInt(item.dbSize.split('=')[1], 10) : 0));
          }
        }
      });
    }, 100);
  }

  // 总结生成方法
  summaryFn() {
    this.ticketObj.summary = '';
    this.ticketObj.lines.forEach((item, i) => {
      this.ticketObj.summary += this.lines[i].name + '=' + item.value + '支  ';
    });
  }

  // 计算线条数量
  countLine() {
    this.ticketObj.lines = [
      { value: 0 },
      { value: 0 },
      { value: 0 },
      { value: 0 },
    ];
    this.productList.forEach(item => {
      item.lines.forEach((ob, index) => {
        if (ob.value) {
          this.ticketObj.lines[index].value +=
            parseInt(ob.value, 10) * item.sum;
        }
      });
    });
    let sumLine = 0;
    this.ticketObj.lines.forEach(item => {
      sumLine += item.value;
    });
    this.ticketObj.sumLine = sumLine;
  }

  createTimeDisabled = (current: Date): boolean => {
    if (this.ticketObj.startTime) {
      return current.getTime() > new Date(this.ticketObj.startTime).getTime();
    } else {
      return false;
    }
  };

  startTimeDisabled = (current: Date): boolean => {
    if (this.ticketObj.endTime) {
      return (
        current.getTime() > new Date(this.ticketObj.endTime).getTime() ||
        current.getTime() < new Date(this.ticketObj.createTime).getTime()
      );
    } else {
      return false;
    }
  };

  endTimeDisabled = (current: Date): boolean => {
    if (this.ticketObj.startTime) {
      return current.getTime() < new Date(this.ticketObj.startTime).getTime();
    } else {
      return false;
    }
  };

  getUser() {
    this.http
      .post(`./v1/user/list?pageNum=1&pageSize=10000`, {
        roles: '101',
      })
      .subscribe((res: ResponsePageVo) => {
        this.marketList = res.response.data;
      });
    this.http
      .post(`./v1/user/list?pageNum=1&pageSize=10000`, {
        roles: '102',
      })
      .subscribe((res: ResponsePageVo) => {
        this.dealersList = res.response.data;
      });
  }

  printComplete() {
    console.log('打印完成！');
    this.printObj = this.printObj1;
    this.setTrSum();
    // this.showHead = true;
    // this.hideTable1 = false;
  }
  print(k) {
    // this.showHead = false;
    // this.hideTable1 = true;
    this.printObj = this[k];
    this.setTrSum();
    setTimeout(() => {
      this.printComponent.print();
    }, 100);
  }
}

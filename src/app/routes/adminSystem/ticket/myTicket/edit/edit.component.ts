import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { ENgxPrintComponent } from 'e-ngx-print';
import { ResponsePageVo } from '@interface/utils/ResponsePageVo';

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

  ticket = {};
  gxList = [];

  showHead: boolean = true;
  hideTable1: boolean = false;
  datas: any[];
  printCSS: string[] = ['./assets/tmp/css/ticket.css'];
  printStyle: string;
  @ViewChild('print1') printComponent1: ENgxPrintComponent;

  item = {};
  constructor(
    private elRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private reuseTabService: ReuseTabService,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.getGxList();
    if (this.id) {
      this.title = '编辑';

    }
  }
  save(value: any) {
    if (this.id) {
      this.http.post(`/cfmy/ticket/update`,
        value)
        .subscribe(res => {
          this.msgSrv.success('修改成功');
          this.back();
        });
    } else {
      this.http.post(`/cfmy/ticket/add`,
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
    this.http.post(`/cfmy/gx/list?pageNum=1&pageSize=1000`, {})
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

  printComplete() {
    console.log('打印完成！');
    this.showHead = true;
    this.hideTable1 = false;
  }

  print() {
    this.showHead = false;
    this.hideTable1 = true;
    this.printComponent1.print();
  }
}

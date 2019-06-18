import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';
import {
  STColumn,
  STComponent,
  STRes,
  STReq,
  STPage,
  STData,
  STColumnButton,
} from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeDataService } from '@shared/services/code-data.service';
import { delay, map } from 'rxjs/operators';
import { ResponsePageVo } from '@interface/utils/ResponsePageVo';

@Component({
  selector: 'app-my-ticket-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.less'],
})
export class MyTicketListComponent implements OnInit {
  title;
  url = `./v1/ticket/list`;
  pageSize = 30;
  req: STReq = {
    params: {},
    method: 'post',
    body: {
      state: [],
      editId:
        this.settingsService.user.roles.indexOf('100') === -1
          ? this.settingsService.user.id
          : null,
    },
    reName: { pi: 'pageNum', ps: 'pageSize' },
  };
  res: STRes = {
    reName: { total: 'response.pageCount', list: 'response.data' },
    process: (data: any) => {
      data.forEach((item, i) => {
        item.no = (this.st.pi - 1) * this.st.ps + i + 1;
        item.img = './v1/public/file/getById?id=' + item.img;
      });
      return data;
    },
  };
  page: STPage = {
    showSize: true,
  };
  searchSchema: SFSchema = {
    properties: {
      number: {
        type: 'string',
        title: '编号',
      },
      dealersId: {
        title: '经销商',
        type: 'string',
        default: '',
        ui: {
          widget: 'select',
          asyncData: (name: string) => {
            return this.http
              .post(
                './v1/user/list',
                { roles: '102' },
                { pageNum: 1, pageSize: 1000 },
              )
              .pipe(
                delay(1200),
                map((item: ResponsePageVo) => {
                  if (!item.response.data.length) return [];
                  return [
                    {
                      label: '--全部--',
                      value: '',
                    },
                  ].concat(
                    item.response.data.map(obj => {
                      return {
                        label: obj.name,
                        value: obj.id,
                      };
                    }),
                  );
                }),
              );
          },
          width: 200,
        },
      },
      marketId: {
        title: '销售',
        type: 'string',
        default: '',
        ui: {
          widget: 'select',
          asyncData: (name: string) => {
            return this.http
              .post(
                './v1/user/list',
                { roles: '101' },
                { pageNum: 1, pageSize: 1000 },
              )
              .pipe(
                delay(1200),
                map((item: ResponsePageVo) => {
                  if (!item.response.data.length) return [];
                  return [
                    {
                      label: '--全部--',
                      value: '',
                    },
                  ].concat(
                    item.response.data.map(obj => {
                      return {
                        label: obj.name,
                        value: obj.id,
                      };
                    }),
                  );
                }),
              );
          },
          width: 200,
        },
      },
      editId: {
        title: '制单人',
        type: 'string',
        default: '',
        ui: {
          widget: 'select',
          asyncData: (name: string) => {
            return this.http
              .post(
                './v1/user/list',
                { roles: '107' },
                { pageNum: 1, pageSize: 1000 },
              )
              .pipe(
                delay(1200),
                map((item: ResponsePageVo) => {
                  if (!item.response.data.length) return [];
                  return [
                    {
                      label: '--全部--',
                      value: '',
                    },
                  ].concat(
                    item.response.data.map(obj => {
                      return {
                        label: obj.name,
                        value: obj.id,
                      };
                    }),
                  );
                }),
              );
          },
          width: 200,
          hidden: this.settingsService.user.roles.indexOf('100') === -1,
        },
      },
    },
  };

  butLis: STColumnButton[] = [
    {
      text: this.router.url.indexOf('ticket/myTicket') !== -1 ? '编辑' : '查看',
      click: (item: any) => {
        this.add(item);
      },
    },
  ];

  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'number' },
    { title: '制单', index: 'editName' },
    { title: '经销商', index: 'dealersName' },
    { title: '业务经理', index: 'marketName' },
    {
      title: '状态',
      index: 'state',
      type: 'tag',
      tag: {
        1500: {
          text: this.codeDataService.getName(1500),
          color: 'green',
        },
        1503: {
          text: this.codeDataService.getName(1503),
          color: 'green',
        },
        1505: {
          text: this.codeDataService.getName(1505),
          color: 'magenta',
        },
        1507: {
          text: this.codeDataService.getName(1507),
          color: 'green',
        },
        1510: {
          text: this.codeDataService.getName(1510),
          color: 'green',
        },
        1513: {
          text: this.codeDataService.getName(1513),
          color: 'green',
        },
        1516: {
          text: this.codeDataService.getName(1516),
          color: 'green',
        },
        1519: {
          text: this.codeDataService.getName(1519),
          color: 'green',
        },
        1522: {
          text: this.codeDataService.getName(1522),
          color: 'green',
        },
        1525: {
          text: this.codeDataService.getName(1525),
          color: 'green',
        },
        1529: {
          text: this.codeDataService.getName(1529),
          color: 'green',
        },
      },
    },
    {
      title: '排产日期',
      type: 'date',
      index: 'startTime',
      dateFormat: 'YYYY-MM-DD',
    },
    {
      title: '交货日期',
      type: 'date',
      index: 'endTime',
      dateFormat: 'YYYY-MM-DD',
    },
    {
      title: '操作',
      buttons: this.butLis,
    },
  ];
  constructor(
    private http: _HttpClient,
    private router: Router,
    private msgSrv: NzMessageService,
    public activatedRoute: ActivatedRoute,
    private codeDataService: CodeDataService,
    private settingsService: SettingsService,
  ) {}
  ngOnInit() {
    if (this.router.url.indexOf('ticket/myTicket') !== -1) {
      this.req.body.state = [1500, 1505];
      this.butLis.push({
        text: '提交审核',
        pop: true,
        popTitle: '确认提交审核？',
        click: (item: any) => {
          this.upState(item, 1503);
        },
      });
    }
    if (this.router.url.indexOf('ticket/shTicket') !== -1) {
      this.req.body.state = [1503];
      this.butLis.push({
        text: '通过',
        pop: true,
        popTitle: '确认通过？',
        click: (item: any) => {
          this.upState(item, 1507);
        },
      });
      this.butLis.push({
        text: '驳回',
        pop: true,
        popTitle: '确认驳回？',
        click: (item: any) => {
          this.upState(item, 1505);
        },
      });
    }
    if (this.router.url.indexOf('ticket/dscTicket') !== -1) {
      this.req.body.state = [1507];
    }
    if (this.router.url.indexOf('ticket/scTicket') !== -1) {
      this.req.body.state = [1510, 1513];
    }
    if (this.router.url.indexOf('ticket/scwcTicket') !== -1) {
      this.req.body.state = [1516];
      this.butLis.push({
        text: '已经发货',
        pop: true,
        popTitle: '确认已经发货？',
        click: (item: any) => {
          this.upState(item, 1519);
        },
      });
    }
    if (this.router.url.indexOf('ticket/fhTicket') !== -1) {
      this.req.body.state = [1519];
      this.butLis.push({
        text: '收款完成',
        pop: true,
        popTitle: '确认收款完成？',
        click: (item: any) => {
          this.upState(item, 1529);
        },
      });
    }
    if (this.router.url.indexOf('ticket/overTicket') !== -1) {
      this.req.body.state = [1529];
    }
  }
  _onReuseInit() {
    this.st.reload();
  }

  search(e) {
    this.st.req.body = Object.assign({}, this.req.body, e);
    this.st.load(1);
  }
  stChange(item) {}
  upState(item, k) {
    this.http
      .get(`./v1/ticket/updateState?id=${item.id}&state=${k}`)
      .subscribe((data: ResponseVo) => {
        this.msgSrv.success('成功');
        this.st.reload();
      });
  }
  add(item?) {
    this.router.navigate([this.router.url + '/edit'], {
      queryParams: { id: item ? item.id || '' : '' },
    });
  }
  del(id) {
    this.http.get(`./v1/ticket/del?id=${id}`).subscribe((data: ResponseVo) => {
      this.msgSrv.success('成功');
      this.st.reload();
    });
  }
}

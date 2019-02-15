import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STPage, STData, STColumnButton } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeDataService } from '@shared/services/code-data.service';

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
    body: {},
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
    }
  };
  page: STPage = {
    showSize: true,
  };
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称'
      }
    }
  };

  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'number' },
    { title: '制单', index: 'editName' },
    { title: '经销商', index: 'dealersName' },
    { title: '业务经理', index: 'marketName' },
    {
      title: '状态', index: 'state', type: 'tag',
      tag: {
        1502: {
          text: this.codeDataService.getName(1502),
          color: 'magenta'
        },
        1501: {
          text: this.codeDataService.getName(1501),
          color: 'green'
        }
      }
    },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑', click: (item: any) => {
            this.add(item);
          }
        },
        {
          text: '删除', type: 'del', click: (item: any) => {
            this.del(item.id);
          }
        },
      ]
    }
  ];
  constructor(
    private http: _HttpClient,
    private router: Router,
    private msgSrv: NzMessageService,
    public activatedRoute: ActivatedRoute,
    private codeDataService: CodeDataService,
  ) {

  }
  ngOnInit() {
  }
  _onReuseInit() {
    this.st.reload();
  }


  search(e) {
    this.st.req.body = Object.assign({}, this.req.body, e);
    this.st.load(1);
  }
  stChange(item) {

  }
  add(item?) {
    this.router.navigate(['/admin/ticket/myTicket/edit'], { queryParams: { id: item ? item.id || '' : '' } });
  }
  del(id) {
    this.http.get(`./v1/ticket/del?id=${id}`)
      .subscribe((data: ResponseVo) => {
        this.msgSrv.success('成功');
        this.st.reload();
      });
  }
  
}

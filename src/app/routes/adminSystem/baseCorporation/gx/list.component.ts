import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STPage, STData, STColumnButton } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeDataService } from '@shared/services/code-data.service';
@Component({
  selector: 'app-gx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.less'],
})
export class GxListComponent implements OnInit {
  title;
  url = `/v1/gx/list`;
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
        title: '工序名'
      }
    }
  };

  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '序号', index: 'indexKey' },
    { title: '工序名(name)', index: 'name' },
    { title: '默认价格(price)', index: 'price' },
    {
      title: '状态(state)', index: 'state', type: 'tag',
      tag: {
        1202: {
          text: this.codeDataService.getName(1202),
          color: 'magenta'
        },
        1201: {
          text: this.codeDataService.getName(1201),
          color: 'green'
        }
      }
    },
    {
      title: '操作',
      buttons: [
        {
          text: '起用', click: (item: any) => {
            this.updateState(item.id, 1201);
          },
          iif: (item: STData, btn: STColumnButton, column: STColumn) => {
            if (item.state === 1201) {
              return false;
            } else {
              return true;
            }
          }
        },
        {
          text: '禁用', click: (item: any) => {
            this.updateState(item.id, 1202);
          },
          iif: (item: STData, btn: STColumnButton, column: STColumn) => {
            if (item.state === 1202) {
              return false;
            } else {
              return true;
            }
          }
        },
        {
          text: '编辑', click: (item: any) => {
            this.add(item);
          }
        },
        {
          text: '删除', type: 'del', click: (item: any) => {
            this.updateState(item.id, 1200);
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
  ) { }

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
    this.router.navigate(['/admin/baseCorporation/gx/edit'], { queryParams: { id: item ? item.id || '' : '' } });
  }
  updateState(id, state) {
    this.http.get(`/v1/gx/updateState?id=${id}&state=${state}`)
      .subscribe((data: ResponseVo) => {
        this.msgSrv.success('成功');
        this.st.reload();
      });
  }
}

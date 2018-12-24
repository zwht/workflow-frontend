import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STPage, STData } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { UserIndexDetailComponent } from './detail/detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeDataService } from '@shared/services/code-data.service';

@Component({
  selector: 'app-user-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.less'],
})
export class UserIndexComponent implements OnInit {
  title;
  url = `/cfmy/user/list`;
  pageSize = 10;
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
        item.roles = item.roles.split(',').map(o => {
          return this.codeDataService.getName(o);
        }).join('，');
      });
      return data;
    }
  };
  page: STPage = {
  };
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名字'
      },
      loginName: {
        type: 'string',
        title: '登录名'
      }
    }
  };
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'no' },
    { title: '登录名', index: 'loginName' },
    { title: '名字', index: 'name' },
    { title: '角色', index: 'roles' },
    { title: 'phone', index: 'phone' },
    {
      title: '操作',
      buttons: [
        {
          text: '查看', type: 'static', params: (record: STData) => {
            return { record };
          }, component: UserIndexDetailComponent, click: 'reload'
        },
        {
          text: '编辑', click: (item: any) => {
            this.add(item);
          }
        },
        {
          text: '删除', type: 'del', click: (item: any) => {
            this.http.get(`/cfmy/user/del?id=${item.id}`)
              .subscribe((data: ResponseVo) => {
                this.msgSrv.success('删除成功');
                this.st.reload();
              });
          }
        },
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private router: Router,
    private msgSrv: NzMessageService,
    public activatedRoute: ActivatedRoute,
    private codeDataService: CodeDataService
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
  add(item?) {
    this.router.navigate(['/admin/user/edit'], { queryParams: { id: item ? item.id || '' : '' } });
  }
}

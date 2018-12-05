import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STPage, STData } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { UserIndexDetailComponent } from './detail/detail.component';
import { ActivatedRoute, Router } from '@angular/router';

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
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private router: Router,
    public activatedRoute: ActivatedRoute,
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
    this.router.navigateByUrl('/admin/user/edit', { queryParams: { item: item || {} } });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STPage, STData } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { UserIndexDetailComponent } from './detail/detail.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.less'],
})
export class UserIndexComponent implements OnInit {
  title;
  url = `/cfmy/user/list`;
  req: STReq = {
    params: { pageSize: 1 },
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
      title: '',
      buttons: [
        {
          text: '查看', type: 'static', params: (record: STData) => {
            return { record };
          }, component: UserIndexDetailComponent, click: 'reload'
        },
        { text: '编辑', click: (item: any) => `/add/${item.id}` },
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
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
  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }
}

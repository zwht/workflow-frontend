import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STData } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { UserIndexDetailComponent } from './detail/detail.component';

@Component({
  selector: 'app-user-index',
  templateUrl: './index.component.html',
})
export class UserIndexComponent implements OnInit {
  url = `/cfmy/user/list`;
  req: STReq = {
    params: {},
    method: 'post',
    body: {},
    reName: { pi: 'pageNum', ps: 'pageSize' },
  };
  res: STRes = {
    reName: { total: 'data.pageCount', list: 'data.data' },
    process: (data: any) => {
      return data;
    }
  };
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名字'
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
        { text: '查看', click: (item: any) => `/add/${item.id}` },
        { text: '编辑', type: 'static', component: UserIndexDetailComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() { }

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

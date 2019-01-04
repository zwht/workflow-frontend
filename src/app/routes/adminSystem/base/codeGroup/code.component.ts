import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STPage, STData } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-user-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.less'],
})
export class CodeGroupComponent implements OnInit {
  title;
  url = `./v1/codeGroup/list`;
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
    showSize: true,
  };
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '码组名'
      }
    }
  };
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'no' },
    { title: '码组名(name)', index: 'name' },
    { title: '值(value)', index: 'value' },
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
            this.http.get(`./v1/codeGroup/del?id=${item.id}`)
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
    this.router.navigate(['/admin/base/codeGroup/edit'], { queryParams: { id: item ? item.id || '' : '' } });
  }
}

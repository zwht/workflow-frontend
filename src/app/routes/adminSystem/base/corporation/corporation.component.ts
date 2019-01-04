import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STPage } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeDataService } from '@shared/services/code-data.service';
@Component({
  selector: 'app-corporation',
  templateUrl: './corporation.component.html',
})
export class CorporationComponent implements OnInit {
  title;
  url = `./v1/corporation/list`;
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
        item.ability = item.ability.split(',').map(o => {
          return this.codeDataService.getName(o);
        }).join('，');
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
        title: '公司名'
      }
    }
  };

  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'no' },
    { title: '公司名', index: 'name' },
    { title: '权限', index: 'ability' },
    { title: '状态', index: 'state' },
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
            this.http.get(`./v1/corporation/del?id=${item.id}`)
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
  stChange(item) {

  }
  add(item?) {
    this.router.navigate(['/admin/base/corporation/edit'], { queryParams: { id: item ? item.id || '' : '' } });
  }
}

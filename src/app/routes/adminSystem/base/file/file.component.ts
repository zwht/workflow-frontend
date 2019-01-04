import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STPage, STData } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzMessageService } from 'ng-zorro-antd';
import { FileDetailComponent } from './detail/detail.component';

@Component({
  selector: 'app-file-cpt',
  templateUrl: './file.component.html',
  styleUrls: ['./file.less'],
})
export class FileComponent implements OnInit {
  title;
  url = `./v1/file/list`;
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
        item.url = './v1/public/file/getById?id=' + item.id;
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
    { title: 'ID', index: 'id' },
    { title: '文件类型', index: 'fileType' },
    { title: '文件夹', index: 'type' },
    { title: 'url', index: 'url' },
    {
      title: '操作',
      buttons: [
        {
          text: '查看', type: 'static', params: (record: STData) => {
            return { record };
          }, component: FileDetailComponent, click: 'reload'
        },
        {
          text: '编辑', click: (item: any) => {
            this.add(item);
          }
        },
        {
          text: '删除', type: 'del', click: (item: any) => {
            this.http.get(`./v1/file/del?id=${item.id}`)
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
    this.router.navigate(['/admin/base/file/edit'], { queryParams: { id: item ? item.id || '' : '' } });
  }
}

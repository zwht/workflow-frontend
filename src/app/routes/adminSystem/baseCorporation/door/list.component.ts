import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STPage, STData, STColumnButton } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzMessageService } from 'ng-zorro-antd';
import { CodeDataService } from '@shared/services/code-data.service';
import { delay, map } from 'rxjs/operators';
import { ResponsePageVo } from '@interface/utils/ResponsePageVo';

@Component({
  selector: 'app-door-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.less'],
})
export class DoorListComponent implements OnInit {
  title;
  url = `./v1/door/list`;
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
        item.type = this.codeDataService.getName(item.type);
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
      },
      number: {
        type: 'string',
        title: '编号'
      },
      type: {
        type: 'string',
        title: '类型',
        ui: {
          widget: 'select',
          nzAllowClear: true,
          asyncData: (name: string) => {
            return this.http.post('./v1/public/code/list', {
              groupId: '291996688304967680'
            }, { pageNum: 1, pageSize: 1000 })
              .pipe(
                delay(120),
                map((item: ResponsePageVo) => {
                  if (!item.response.data.length) return [];
                  return [{
                    label: '--全部--',
                    value: '',
                  }].concat(
                    item.response.data.map(obj => {
                      return {
                        label: obj.name,
                        value: obj.value,
                      };
                    })
                  );
                })
              );
          },
          width: 200
        }
      }
    }
  };

  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '序号', index: 'no' },
    { title: '名称', index: 'name' },
    { title: '编号', index: 'number' },
    {
      title: '类型', index: 'type'
    },
    {
      title: '图片', index: 'img', type: 'img', width: '150px',
      className: 'imgTd'
    },
    {
      title: '状态', index: 'state', type: 'tag',
      tag: {
        1402: {
          text: this.codeDataService.getName(1402),
          color: 'magenta'
        },
        1401: {
          text: this.codeDataService.getName(1401),
          color: 'green'
        }
      }
    },
    {
      title: '操作',
      buttons: [
        {
          text: '起用', click: (item: any) => {
            this.updateState(item.id, 1401);
          },
          iif: (item: STData, btn: STColumnButton, column: STColumn) => {
            if (item.state === 1401) {
              return false;
            } else {
              return true;
            }
          }
        },
        {
          text: '禁用', click: (item: any) => {
            this.updateState(item.id, 1402);
          },
          iif: (item: STData, btn: STColumnButton, column: STColumn) => {
            if (item.state === 1402) {
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
    this.router.navigate(['/admin/baseCorporation/door/edit'], { queryParams: { id: item ? item.id || '' : '' } });
  }
  updateState(id, state) {
    this.http.get(`./v1/door/updateState?id=${id}&state=${state}`)
      .subscribe((data: ResponseVo) => {
        this.msgSrv.success('成功');
        this.st.reload();
      });
  }
  del(id) {
    this.http.get(`./v1/gx/del?id=${id}`)
      .subscribe((data: ResponseVo) => {
        this.msgSrv.success('成功');
        this.st.reload();
      });
  }
}

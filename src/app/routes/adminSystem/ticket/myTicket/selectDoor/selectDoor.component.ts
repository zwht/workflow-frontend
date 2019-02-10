import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, STComponent, STRes, STReq, STPage, STData, STColumnButton } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { CodeDataService } from '@shared/services/code-data.service';
import { delay, map } from 'rxjs/operators';
import { ResponsePageVo } from '@interface/utils/ResponsePageVo';
@Component({
  selector: 'app-door-list',
  templateUrl: './selectDoor.component.html',
  styleUrls: ['./selectDoor.less'],
})
export class SelectDoorComponent implements OnInit {
  title;
  pageSize = 12;
  total = 0;
  page = 1;
  list = [];

  @Input() gxList: any[];
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
        default: '1301,1302',
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
                    value: '1301,1302',
                  }].concat(
                    item.response.data.filter(obj => {
                      return obj.value < 1350;
                    }).map(obj => {
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
      title: '图片', index: 'img', type: 'img', width: '150px',
      className: 'imgTd'
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: NzModalRef,
    public activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.getList();
  }
  _onReuseInit() {
  }

  search(e) {
    this.getList(e);
  }

  getList(data?) {
    this.http.post(`./v1/door/list?pageNum=${this.page}&pageSize=${this.pageSize}`,
      data || {})
      .subscribe((res: ResponseVo) => {
        if (res.response) {
          this.total = res.response.pageCount;
          this.list = res.response.data;
        }
      });
  }

  pageChange = (e) => {
    this.page = e;
    this.getList();
  }

  pageSizeChange = (e) => {
    this.page = 1;
    this.pageSize = e;
    this.getList();
  }

  selectItem(door) {
    const gxIds = door.gxIds.split(','), gxValues = door.gxValues.split(',');
    door.gxList = [];
    this.gxList.forEach(item => {
      gxIds.forEach((obj, i) => {
        if (obj === item.id) {
          item.price = gxValues[i];
          door.gxList.push(item);
        }
      });
    });
    this.modal.destroy({ data: door });
  }
}

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-color-list',
  templateUrl: './selectColor.component.html',
  styleUrls: ['./selectColor.less'],
})
export class SelectColorComponent implements OnInit {
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
      Object.assign((data || {}), { type: '1350' }))
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

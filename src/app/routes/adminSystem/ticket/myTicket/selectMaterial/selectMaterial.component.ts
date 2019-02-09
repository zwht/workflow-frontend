import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, STComponent} from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-material-list',
  templateUrl: './selectMaterial.component.html',
  styleUrls: ['./selectMaterial.less'],
})
export class SelectMaterialComponent implements OnInit {
  title;
  url = `./v1/material/list`;
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
    this.http.post(`./v1/material/list?pageNum=${this.page}&pageSize=${this.pageSize}`,
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

  selectItem(material) {
    this.modal.destroy({ data: material });
  }
}

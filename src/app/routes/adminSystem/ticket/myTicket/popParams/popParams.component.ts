import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-pop-params',
  templateUrl: './popParams.component.html',
  styleUrls: ['./popParams.less'],
})
export class PopParamsComponent implements OnInit {
  title;

  @Input() gxList: any;
  list = []
  constructor(
    private http: _HttpClient,
    private modal: NzModalRef,
    public activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.list = JSON.parse(this.gxList.gxParams).map(item => {
      if (item.type == 2) {
        item.params = item.params.map(obj => {
          const l = obj.split('#')
          return {
            old: obj,
            name: l[0],
            value: l[1]
          }
        })
        item.value = item.params[0].value
      }
      if (item.type == 3) {
        item.value = item.params
      }
      return item
    })
  }
  save(door) {
    const gxIds = this.gxList.gxIds.split(','),
      gxValues = this.gxList.gxValues.split(',');
    const gxList = [];
    this.list.forEach(item => {
      gxIds.forEach((id, i) => {
        if (id === item.gxId) {
          gxValues[i] = item.value+''
        }
      });
    });
    this.gxList.gxValues=gxValues.join(',')
    this.modal.destroy({
      data: this.gxList,
    });
  }
  close() {
    this.modal.destroy();
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzModalRef } from 'ng-zorro-antd';


@Component({
  selector: 'app-door-select-gx',
  templateUrl: './selectGx.component.html',
  styleUrls: ['./selectGx.less'],
})
export class SelectGxComponent implements OnInit {

  @Input() gxList: any[];
  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
  ) {
  }

  ngOnInit(): void {
  }
  destroyModal(): void {
    this.modal.destroy({ data: false });
  }
  clickItem(item) {
    this.modal.destroy({ data: item });
  }
}

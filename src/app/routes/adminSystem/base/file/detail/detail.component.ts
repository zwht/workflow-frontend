import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-user-index-detail',
  templateUrl: './detail.component.html',
})
export class FileDetailComponent implements OnInit {
  // @Input()
  record: any = {};
  i: any;
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    this.i = this.record;
    // http://localhost:4201/cfmy/public/file/getById?id=274708819454595072
    // this.http.get(`/cfmy/user/getById?id=${this.record.id}`).subscribe(res => this.i = res);
  }

  close() {
    this.modal.destroy();
  }
}

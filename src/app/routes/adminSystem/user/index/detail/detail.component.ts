import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-user-index-detail',
  templateUrl: './detail.component.html',
})
export class UserIndexDetailComponent implements OnInit {
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
    // this.http.get(`./v1/user/getById?id=${this.record.id}`).subscribe(res => this.i = res);
  }

  close() {
    this.modal.destroy();
  }
}

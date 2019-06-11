import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ResponseVo } from '@interface/utils/ResponseVo';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor(private http: _HttpClient) {}
  ticketSum = [];
  ngOnInit() {
    this.getTicketSum();
  }
  getTicketSum() {
    this.http
      .post(`./v1/statistics/getTicketSum`, {
        startTime: moment()
          .month(moment().month() - 1)
          .startOf('month')
          .valueOf(),
        endTime: moment()
          .endOf('month')
          .endOf('month'),
        type: 2,
      })
      .subscribe((res: ResponseVo) => {
        this.ticketSum = res.response;
        debugger;
      });
    this.http
      .post(`./v1/statistics/getTicketSum`, {
        startTime: moment().startOf('year'),
        endTime: moment()
          .endOf('year')
          .endOf('year'),
        type: 3,
      })
      .subscribe((res: ResponseVo) => {
        this.ticketSum = res.response;
        debugger;
      });
  }
}

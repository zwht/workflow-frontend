import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ResponseVo } from '@interface/utils/ResponseVo';
import * as moment from 'moment';
import { ResponsePageVo } from '@interface/utils/ResponsePageVo';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.less'],
})
export class DashboardComponent implements OnInit {
  constructor(private http: _HttpClient) {}
  ticketSum = {
    month: {
      create: 0,
      over: 0,
      createDoor: 0,
      overDoor: 0,
    },
    today: {
      create: 0,
      over: 0,
      createDoor: 0,
      overDoor: 0,
    },
    year: {
      create: 0,
      over: 0,
      createDoor: 0,
      overDoor: 0,
    },
    prMonth: {
      create: 0,
      over: 0,
      createDoor: 0,
      overDoor: 0,
    },
    yesterday: {
      create: 0,
      over: 0,
      createDoor: 0,
      overDoor: 0,
    },
  };
  userList1 = [];
  userList = [];
  ngOnInit() {
    this.getTicketSum();
    this.getUserList();
  }
  getUserList() {
    this.http
      .post(`./v1/user/list?pageNum=1&pageSize=100000`, {})
      .subscribe((res: ResponsePageVo) => {
        this.getUserPrice(res.response.data);
      });
  }
  getUserPrice(userList) {
    this.http
      .post(`./v1/statistics/getUserPriceSum`, {
        startTime: moment()
          .startOf('month')
          .valueOf(),
        endTime: moment()
          .endOf('month')
          .endOf('month')
          .valueOf(),
        type: 2,
      })
      .subscribe((res: ResponseVo) => {
        res.response.forEach(item => {
          userList.forEach(obj => {
            if (obj.id === item.userId) {
              item.name = obj.name;
            }
          });
        });
        this.userList = res.response;
      });
    this.http
      .post(`./v1/statistics/getUserPriceSum`, {
        startTime: moment()
          .month(moment().month() - 1)
          .startOf('month')
          .valueOf(),
        endTime: moment()
          .month(moment().month() - 1)
          .endOf('month')
          .valueOf(),
        type: 2,
      })
      .subscribe((res: ResponseVo) => {
        res.response.forEach(item => {
          userList.forEach(obj => {
            if (obj.id === item.userId) {
              item.name = obj.name;
            }
          });
        });
        this.userList1 = res.response;
      });
  }
  getTicketSum() {
    // 本月
    const monthStart = moment()
      .startOf('month')
      .valueOf();
    const monthEnd = moment()
      .endOf('month')
      .endOf('month')
      .valueOf();
    // 本年
    const yearStart = moment()
      .startOf('year')
      .valueOf();
    const yearEnd = moment()
      .endOf('year')
      .endOf('year')
      .valueOf();
    // 今天
    const todayStart = moment()
      .startOf('day')
      .valueOf();
    const todayEnd = moment()
      .endOf('day')
      .endOf('day')
      .valueOf();
    // 昨天
    const yesterdayStart = moment()
      .add(1, 'days')
      .startOf('day')
      .valueOf();
    const yesterdayEnd = moment()
      .add(1, 'days')
      .endOf('day')
      .endOf('day')
      .valueOf();
    // 上月
    const prMonthStart = moment()
      .month(moment().month() - 1)
      .startOf('month')
      .valueOf();
    const prMonthEnd = moment()
      .month(moment().month() - 1)
      .endOf('month')
      .valueOf();
    this.http
      .post(`./v1/ticket/list?pageNum=1&pageSize=100000`, {
        startTime: moment().startOf('year'),
        endTime: moment()
          .endOf('year')
          .endOf('year'),
        type: 2,
      })
      .subscribe((res: ResponseVo) => {
        const data = res.response.data.map(item => {
          item.createTime = item.createTime
            ? moment(item.createTime).valueOf()
            : 0;
          item.endTime = item.endTime ? moment(item.endTime).valueOf() : 0;
          item.startTime = item.startTime
            ? moment(item.startTime).valueOf()
            : 0;
          item.overTime = item.overTime ? moment(item.overTime).valueOf() : 0;
          return item;
        });
        data.forEach(item => {
          if (monthStart <= item.createTime && monthEnd > item.createTime) {
            this.ticketSum.month.create += 1;
            this.ticketSum.month.createDoor += item.sumDoor;
          }
          if (todayStart <= item.createTime && todayEnd > item.createTime) {
            this.ticketSum.today.create += 1;
            this.ticketSum.today.createDoor += item.sumDoor;
          }
          if (yearStart <= item.createTime && yearEnd > item.createTime) {
            this.ticketSum.year.create += 1;
            this.ticketSum.year.createDoor += item.sumDoor;
          }
          if (prMonthStart <= item.createTime && prMonthEnd > item.createTime) {
            this.ticketSum.prMonth.create += 1;
            this.ticketSum.prMonth.createDoor += item.sumDoor;
          }
          if (
            yesterdayStart <= item.createTime &&
            yesterdayEnd > item.createTime
          ) {
            this.ticketSum.yesterday.create += 1;
            this.ticketSum.yesterday.createDoor += item.sumDoor;
          }

          if (item.overTime) {
            if (monthStart <= item.overTime && monthEnd > item.overTime) {
              this.ticketSum.month.over += 1;
              this.ticketSum.month.overDoor += item.sumDoor;
            }
            if (todayStart <= item.overTime && todayEnd > item.overTime) {
              this.ticketSum.today.over += 1;
              this.ticketSum.today.overDoor += item.sumDoor;
            }
            if (yearStart <= item.overTime && yearEnd > item.overTime) {
              this.ticketSum.year.over += 1;
              this.ticketSum.year.overDoor += item.sumDoor;
            }
            if (prMonthStart <= item.overTime && prMonthEnd > item.overTime) {
              this.ticketSum.prMonth.over += 1;
              this.ticketSum.prMonth.overDoor += item.sumDoor;
            }
            if (
              yesterdayStart <= item.overTime &&
              yesterdayEnd > item.overTime
            ) {
              this.ticketSum.yesterday.over += 1;
              this.ticketSum.yesterday.overDoor += item.sumDoor;
            }
          }
        });
      });
  }
}

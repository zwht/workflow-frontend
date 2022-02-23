/**
 * Created by zhaowei on 2018/7/12.
 */
import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { _HttpClient } from '@delon/theme';
import { ResponseVo } from '@interface/utils/ResponseVo';

@Injectable({
  providedIn: 'root'
})
export class CodeDataService {
  codeList = [];
  codeObjList = {};
  codeObj = {};

  constructor(private http: _HttpClient,
    private sessionService: SessionService) {
    this.getDataLocalStorage();
  }
  getDataLocalStorage() {
    if (this.sessionService.getItem('codeObjList')) {
      this.codeObjList = JSON.parse(this.sessionService.getItem('codeObjList'));
    }
    if (this.sessionService.getItem('codeObj')) {
      this.codeObj = JSON.parse(this.sessionService.getItem('codeObj'));
    }
    if (this.sessionService.getItem('codeList')) {
      this.codeList = JSON.parse(this.sessionService.getItem('codeList'));
    }
    if (!this.codeList.length) {
      this.getData();
    }
  }
  getData() {
    this.http.post('./v1/public/code/list',
      {},
      { pageNum: 1, pageSize: 1000 })
      .subscribe((data: ResponseVo) => {
        if (data.status === 200) {
          this.codeObjList = {};
          this.codeObj = {};
          this.codeList = data.response.data;
          this.codeList.forEach(item => {
            this.codeObj[item.value] = item.name;
            if (this.codeObjList[item.groupValue]) {
              this.codeObjList[item.groupValue].push(Object.assign({
                value: item.value,
                label: item.name
              }, item));
            } else {
              this.codeObjList[item.groupValue] = [Object.assign({
                value: item.value,
                label: item.name
              }, item)];
            }
          });
          this.sessionService.setItem('codeObjList', JSON.stringify(this.codeObjList));
          this.sessionService.setItem('codeList', JSON.stringify(this.codeList));
          this.sessionService.setItem('codeObj', JSON.stringify(this.codeObj));
        }
      });
  }
  getGroup(group) {
    if (this.codeObjList[group]) {
      return this.codeObjList[group];
    } else {
      return [];
    }
  }
  getName(key) {
    let name = this.codeObj[key];
    if (!name) {
      name = key;
    }
    return name;
  }
}

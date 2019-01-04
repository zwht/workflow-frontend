import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';
import { delay, map } from 'rxjs/operators';
@Component({
  selector: 'app-corporation-edit',
  templateUrl: './edit.component.html',
})
export class CorporationEditComponent implements OnInit {
  @ViewChild('sf') sf: SFComponent;
  title = '添加';
  cpName = '公司';
  id = this.route.snapshot.queryParams.id;
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '公司名', maxLength: 30 },
      ability: { type: 'string', title: '权限' },
    },
    required: ['ability', 'name'],
  };
  corporationGroupList = [];
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      width: 500,
      grid: { span: 24 },
    },
    $ability: {
      widget: 'select',
      mode: 'tags',
      asyncData: (name: string) => {
        return this.http.post('./v1/public/code/list',
          { valueStart: 200, valueEnd: 299 },
          { pageNum: 1, pageSize: 1000 })
          .pipe(
            // delay(1200),
            map((item: ResponseVo) => {
              if (!item.response.data.length) return [];
              return item.response.data.map(obj => {
                return {
                  label: obj.name,
                  value: obj.value,
                };
              });
            })
          );
      },
      change: (d) => {
        this.corporationGroupList.forEach(item => {
          if (d === item.id) {
            let v: any = this.sf.value.value ? this.sf.value.value + '' : 0;
            if (v && v.length > 2) {
              v = v.slice(2, v.length);
            }
            const value = Object.assign(this.sf.value, {
              value: item.value + v,
              groupId: item.id,
            });
            this.i = value;
          }
        });
      }
    },
    $name: {
      widget: 'string',
    },
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reuseTabService: ReuseTabService,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.id) {
      this.title = '编辑';
      this.http.get(`./v1/corporation/getById?id=${this.id}`)
        .subscribe((res: ResponseVo) => {
          res.response.ability = res.response.ability ? res.response.ability.split(',').map(item => {
            return parseInt(item, 10);
          }) : [];
          this.i = res.response;
        });
    } else {
      this.i = {};
    }
  }
  save(value: any) {
    if (value.ability && typeof value.ability !== 'string' && value.ability.length) {
      value.ability = value.ability.join(',');
    }
    if (this.id) {
      this.http.post(`./v1/corporation/update`, value).subscribe(res => {
        this.msgSrv.success('修改成功');
        this.back();
      });
    } else {
      this.http.post(`./v1/corporation/add`, value).subscribe(res => {
        this.msgSrv.success('添加成功');
        this.back();
      });
    }
  }
  back() {
    const parentUrl = '/admin/base/corporation';
    if (this.reuseTabService.exists(parentUrl)) {
      this.reuseTabService.replace(parentUrl);
    } else {
      this.router.navigateByUrl(parentUrl);
      setTimeout(() => {
        this.reuseTabService.close('/admin/base/corporation/edit');
      }, 100);
    }
  }
}

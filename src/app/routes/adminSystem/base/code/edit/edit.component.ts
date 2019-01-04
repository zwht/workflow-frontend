import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { ReuseTabService } from '@delon/abc';
import { delay, map } from 'rxjs/operators';
@Component({
  selector: 'app-code-edit',
  templateUrl: './edit.component.html',
})
export class CodeEditComponent implements OnInit {
  @ViewChild('sf') sf: SFComponent;
  title = '添加';
  cpName = '码表';
  id = this.route.snapshot.queryParams.id;
  i: any;
  schema: SFSchema = {
    properties: {
      groupId: { type: 'string', title: '类型' },
      name: { type: 'string', title: '码名', maxLength: 30 },
      value: { type: 'number', title: '码值', maximum: 9999, minimum: 100},
    },
    required: ['groupId', 'name', 'value'],
  };
  codeGroupList = [];
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      width: 500,
      grid: { span: 24 },
    },
    $groupId: {
      widget: 'select',
      asyncData: (name: string) => {
        return this.http.post('./v1/codeGroup/list',
          { name },
          { pageNum: 1, pageSize: 1000 })
          .pipe(
            // delay(1200),
            map((item: ResponseVo) => {
              this.codeGroupList = item.response.data;
              if (!item.response.data.length) return [];
              return item.response.data.map(obj => {
                return {
                  label: obj.name + '(' + obj.value + ')',
                  value: obj.id,
                };
              });
            })
          );
      },
      change: (d) => {
        this.codeGroupList.forEach(item => {
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
    $value: {
      widget: 'number',
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
      this.http.get(`./v1/code/getById?id=${this.id}`)
        .subscribe((res: ResponseVo) => {
          this.i = res.response;
        });
    } else {
      this.i = {};
    }
  }
  save(value: any) {
    if (this.id) {
      this.http.post(`./v1/code/update`, value).subscribe(res => {
        this.msgSrv.success('修改成功');
        this.back();
      });
    } else {
      this.http.post(`./v1/code/add`, value).subscribe(res => {
        this.msgSrv.success('添加成功');
        this.back();
      });
    }
  }
  back() {
    const parentUrl = '/admin/base/code';
    if (this.reuseTabService.exists(parentUrl)) {
      this.reuseTabService.replace(parentUrl);
    } else {
      this.router.navigateByUrl(parentUrl);
      setTimeout(() => {
        this.reuseTabService.close('/admin/base/code/edit');
      }, 100);
    }
  }
}

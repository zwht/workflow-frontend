import { Injectable, Injector, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';

import { NzIconService } from 'ng-zorro-antd';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private viaHttp(resolve: any, reject: any) {
    debugger;
    zip(
      this.httpClient.get('/assets/tmp/app-data.json', {
        responseType: 'json',
      })
    )
      .pipe(
        // 接收其他拦截器后产生的异常消息
        catchError(([appData]) => {
          resolve(null);
          return [appData];
        })
      )
      .subscribe(([appData]) => {
        // application data
        const res: any = appData;
        // 应用信息：包括站点名、描述、年份
        this.settingService.setApp(res.app);
        // 用户信息：包括姓名、头像、邮箱地址
        // this.settingService.setUser(res.user);
        // ACL：设置权限为全量
        this.aclService.setFull(true);
        // 初始化菜单
        this.menuService.add(res.menu);
        // 设置页面标题的后缀
        this.titleService.suffix = res.app.name;
      },
        () => {
        },
        () => {
          resolve({});
        });
  }

  private viaMock(resolve: any, reject: any) {
    const app: any = {
      name: '木门管理系统',
      description: '川峰木门'
    };
    const user: any = {
      name: 'zw',
      avatar: './assets/tmp/img/avatar.jpg',
      email: '1512763623@qq.com',
      token: 'token string'
    };
    // 应用信息：包括站点名、描述、年份
    this.settingService.setApp(app);
    // 用户信息：包括姓名、头像、邮箱地址
    // this.settingService.setUser(user);
    // ACL：设置权限为全量
    this.aclService.setFull(true);
    // 初始化菜单
    this.menuService.add([
      {
        text: '导航组1',
        group: false,
        hideInBreadcrumb: true,
        children: [
          {
            text: '仪表盘',
            link: '/admin/dashboard',
            hideInBreadcrumb: true,
            icon: 'anticon anticon-appstore',
          },
          {
            text: '用户管理',
            icon: 'anticon anticon-team',
            children: [
              {
                text: '用户列表',
                link: '/admin/user/index',
              }
            ]
          },
          {
            text: '基础数据模块',
            icon: 'anticon anticon-build',
            children: [
              {
                text: '码表列表',
                link: '/admin/base/code',
              },
              {
                text: 'icon图标',
                link: '/admin/base/icon',
              }
            ]
          },
        ]
      }
    ]);
    // 设置页面标题的后缀
    this.titleService.suffix = app.name;
    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      debugger
      this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      // this.viaMock(resolve, reject);
    });
  }
}

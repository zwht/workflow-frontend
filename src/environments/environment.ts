// This file can be replaced during build by using the `fileReplacements` array.
// 这个文件可以被替换在构建使用“fileReplacements”数组。
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// “ng build ---prod”取代 “environment.ts' 与 'environment.prod.ts”。
// The list of file replacements can be found in `angular.json`.
// 文件替换列表中可以找到“angular.json”。

export const environment = {
  SERVER_URL: `http://localhost:8888`,
  production: false,
  useHash: true,
  hmr: false,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
/* 在开发模式中,忽略区等相关错误堆栈帧“zone.run”、“zoneDelegate。
invokeTask更易于调试,可以导入以下文件,
请在生产方式发表评论因为它会抛出错误时性能的影响
*/
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

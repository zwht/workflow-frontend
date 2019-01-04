import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// #region third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';

import { ZwMouseSetDirective } from './directives/zw-mouse-set.directive';
import { CodeNamePipe } from './pipe/code-name.pipe';
// 打印模块
import { ENgxPrintModule } from 'e-ngx-print';
import { CropperImgComponent } from './components/cropper-img/cropper-img.component';
import { CropperImgModalComponent } from './components/cropper-img-modal/cropper-img-modal.component';
import { ImageCropperModule } from 'ngx-img-cropper';

const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule,
  ENgxPrintModule,
  ImageCropperModule,
];
// #endregion

// #region your componets & directives
const COMPONENTS = [CropperImgComponent];
const DIRECTIVES = [ZwMouseSetDirective];

const ENTERCOMPONENTS = [CropperImgModalComponent];
const PIPES = [CodeNamePipe];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...ENTERCOMPONENTS,
    ...PIPES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  entryComponents: [
    ...ENTERCOMPONENTS
  ]
})
export class SharedModule { }

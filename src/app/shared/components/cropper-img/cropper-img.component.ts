import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  forwardRef,
  OnInit,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { CropperImgModalComponent } from '../cropper-img-modal/cropper-img-modal.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { ResponseVo } from '@interface/utils/ResponseVo';

@Component({
  selector: 'app-cropper-img',
  templateUrl: './cropper-img.component.html',
  styleUrls: ['./cropper-img.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CropperImgComponent),
      multi: true,
    },
  ],
})
export class CropperImgComponent implements ControlValueAccessor, OnInit {
  loading = false;
  dialog = false;
  contentDialogStyle = {};
  fileName = '';
  model: any;
  newBoxStyle;

  @Input()
  boxStyle;
  @ViewChild('inputImage')
  inputImage: ElementRef;
  @Input()
  showBtn;
  @Input()
  imgtype;

  constructor(
    public http: _HttpClient,
    private nzModalService: NzModalService,
  ) {}

  ngOnInit() {
    this.newBoxStyle = {
      width: 200,
      height: 200,
      previewWidth: 200,
      previewHeight: 200,
      bigBoxWidth: 800,
    };
    if (this.boxStyle) {
      this.newBoxStyle.width = this.boxStyle.width ? this.boxStyle.width : 200;
      this.newBoxStyle.height = this.boxStyle.height
        ? this.boxStyle.height
        : 200;
      this.newBoxStyle.previewWidth = this.boxStyle.previewWidth
        ? this.boxStyle.previewWidth
        : this.newBoxStyle.width;
      this.newBoxStyle.previewHeight = this.boxStyle.previewHeight
        ? this.boxStyle.previewHeight
        : this.newBoxStyle.height;
    }
    this.contentDialogStyle = {
      width: this.newBoxStyle.width + 'px',
      height: this.newBoxStyle.height + 'px',
    };
    this.cropperInit();
  }

  public onModelChange: Function = () => {};
  public onModelTouched: Function = () => {};
  writeValue(value: any) {
    this.model = value;
  }
  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  cropperInit() {
    const URL = window.URL;
    if (URL) {
      const that = this;
      this.inputImage.nativeElement.onchange = function() {
        const files = that.inputImage.nativeElement.files;
        let file;
        if (files && files.length) {
          that.dialog = true;
          file = files[0];
          that.fileName = file.name;
          if (/^image\/\w+/.test(file.type)) {
            that.showModalForComponent(file);
          } else {
            window.alert('Please choose an image file.');
          }
        }
      };
    } else {
    }
  }

  showDialog() {
    this.inputImage.nativeElement.setAttribute('type', 'text');
    this.inputImage.nativeElement.setAttribute('type', 'file');
    this.inputImage.nativeElement.click();
  }
  save(base64String) {
    this.loading = true;
    const bytes = window.atob(base64String.split(',')[1]);
    const array = [];
    for (let i = 0; i < bytes.length; i++) {
      array.push(bytes.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('multipartFile', blob, this.fileName);
    this.http
      .post(`./v1/file/add?id=123456&type=${this.imgtype || 'fuck'}`, formData)
      .subscribe((res: ResponseVo) => {
        if (res.status === 200) {
          this.model = res.response.id;
          this.onModelChange(res.response.id);
          this.inputImage.nativeElement.files = null;
          this.dialog = false;
          this.loading = false;
        }
      });
  }

  showModalForComponent(blobURL) {
    const subscription = this.nzModalService.create({
      nzTitle: '裁剪图片',
      nzContent: CropperImgModalComponent,
      nzOnOk() {},
      nzOnCancel() {
        console.log('Click cancel');
      },
      nzWidth: this.newBoxStyle.bigBoxWidth,
      nzFooter: null,
      nzComponentParams: {
        blobURL: blobURL,
        boxStyle: this.newBoxStyle,
      },
    });
    subscription.afterClose.subscribe(result => {
      if (result !== 'onCancel' && result.image) {
        this.save(result.image);
      }
    });
  }
}

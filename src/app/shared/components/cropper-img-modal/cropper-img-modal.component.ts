import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';

@Component({
  selector: 'app-cropper-img-modal',
  templateUrl: './cropper-img-modal.component.html',
  styleUrls: ['./cropper-img-modal.component.less']
})
export class CropperImgModalComponent implements OnInit {

  @Input()
  boxStyle;
  @Input()
  blobURL;

  data: any;
  cropperSettings: CropperSettings;

  @ViewChild('cropperImg', undefined)
  cropperImg: ImageCropperComponent;

  constructor(private modal: NzModalRef) { }

  ngOnInit() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.canvasWidth = this.boxStyle.bigBoxWidth - 270;
    this.cropperSettings.canvasHeight = 350;

    this.cropperSettings.croppedWidth = this.boxStyle.width;
    this.cropperSettings.croppedHeight = this.boxStyle.height;

    this.cropperSettings.width = this.boxStyle.width;
    this.cropperSettings.height = this.boxStyle.height;


    this.data = {};

    setTimeout(() => {
      const image: any = new Image();
      const file: File = this.blobURL;
      const myReader: FileReader = new FileReader();
      myReader.onloadend = (loadEvent: any) => {
        image.src = loadEvent.target.result;
        this.cropperImg.setImage(image);
      };
      myReader.readAsDataURL(file);
    }, 100);
  }

  emitDataOutside() {
    this.modal.destroy(this.data);
  }
  handleCancel() {
    this.modal.destroy('onCancel');
  }
}

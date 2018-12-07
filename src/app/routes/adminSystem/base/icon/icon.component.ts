import { Component, OnInit } from '@angular/core';
import { ICONS } from '../../../../../style-icons';
import { ICONS_AUTO } from '../../../../../style-icons-auto';
import { copy } from '@delon/util';

interface IconObj {
  name: String;
  theme: String;
  icon: String;
}

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.less']
})
export class IconComponent implements OnInit {
  iconList: Array<IconObj>;
  constructor() { }

  ngOnInit() {
    this.iconList = ([].concat(ICONS, ICONS_AUTO)).sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });
  }
  zwHover(e, item) {
    if (!e.value) {
      item.active = false;
    }
  }
  copyIcon(item) {
    item.active = true;
    setTimeout(() => {
      item.active = false;
    }, 2000);
    copy(`<i nz-icon type='${item.name}' theme='${item.theme}'></i>`);
  }
}

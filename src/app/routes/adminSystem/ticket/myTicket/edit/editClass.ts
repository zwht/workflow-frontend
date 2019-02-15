
export class ProductObj {
  indexKey = 0;
  id = null;
  gxList = [];
  doorObj = {
    id: null,
    gxList: [],
    name: null,
  };
  /** 颜色 */
  colorObj = {
    id: null,
    gxList: [],
    name: null,
  };
  /** 材质 */
  materialObj = {
    id: null,
    gxList: [],
    name: null,
  };
  /** 门洞 */
  coverSize = '2345*123*42';
  /** 门扇 */
  doorSize = '2523*123=1';
  /** 立板 */
  lbSize = '2523*123=2';
  /** 顶板 */
  dbSize = '2523*123=1';
  /** 数量 */
  sum = 1;
  /** 备注 */
  remarks = null;
  /** 是否显示详情 */
  show = false;

  lines = [{ value: '' }, { value: '' }, { value: '' }, { value: '' }];

  rowspanColor = 1;
  rowspanColorParent = null;

  rowspanMaterial = 1;
  rowspanMaterialParent = null;

  rowspanDoor = 1;
  rowspanDoorParent = null;

  constructor(public ticketId: string) {
    this.id = this.getId();
  }

  /**
   * 生成id
   */
  private getId() {
    return new Date().getTime() + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
  }
  /**
   * copy
   */
  public copy() {
    return this.copyObjWhenKeyEqual(this, new ProductObj(null));
  }
  private copyObjWhenKeyEqual(copyFrom: Object, copyTo: Object): Object {
    const keysTo = Object.keys(copyTo);
    for (const key of keysTo) {
      if (key !== 'id') {
        copyTo[key] = copyFrom[key];
      }
    }
    return copyTo;
  }
}

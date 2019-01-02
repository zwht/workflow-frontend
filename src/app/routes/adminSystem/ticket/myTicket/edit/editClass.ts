
export class ProductObj {
  id = null;
  ticketId = null;
  doorId = null;
  /** 门洞 */
  coverSize = '2345*123*4';
  /** 门扇 */
  doorSize = '2523*123=23';
  /** 立板 */
  lbSize = '2523*123=23';
  /** 顶板 */
  dbSize = '2523*123=23';
  /** 数量 */
  sum = 1;
  /** 备注 */
  remark = null;
  /** 是否显示详情 */
  show = false;
  /** 颜色 */
  color = null;
  
  constructor(private tkId: string) {
    this.id = this.getId();
    this.ticketId = tkId;
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

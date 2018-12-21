export interface ResponsePageVo {
  msg: String;
  status: number;
  response: {
    pageNum: number;
    pageSize: number;
    pageCount: number;
    data: Array<any>;
  };
  msgObj: Array<any>;
}

import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-user-index-edit',
  templateUrl: './edit.component.html',
})
export class CodeEditComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}

import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-user-index-edit',
  templateUrl: './edit.component.html',
})
export class UserIndexEditComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}

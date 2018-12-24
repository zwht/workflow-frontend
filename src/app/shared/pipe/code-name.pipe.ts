import { Pipe, PipeTransform } from '@angular/core';
import { CodeDataService } from '@shared/services/code-data.service';

@Pipe({
  name: 'codeName'
})
export class CodeNamePipe implements PipeTransform {
  constructor(private codeDataService: CodeDataService) {
  }
  transform(value: any, args?: any): any {
    return this.codeDataService.getName(value);
  }
}

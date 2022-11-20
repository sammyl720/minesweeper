import { Directive, HostBinding, Input } from '@angular/core';
import { CellValue } from 'src/models/types';

@Directive({
  selector: '[appColorize]'
})
export class ColorizeDirective {
  @Input() value: CellValue = CellValue.Empty;
  @HostBinding('style.color') get color() { return this.getColor() }
  constructor() { }

  getColor() {
    if (this.value == CellValue.Empty) {
      return 'black';
    } else if (this.value <= 3) {
      return 'green';
    } else if (this.value <= 5) {
      return 'orange';
    } else {
      return 'red';
    }
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOptionGroup } from 'src/models/types';


@Component({
  selector: 'app-control-option',
  templateUrl: './control-option.component.html',
  styleUrls: ['./control-option.component.scss']
})
export class ControlOptionComponent {
  optionsShown = false;

  @Input() optionGroup: IOptionGroup<any> = {
    header: 'empty',
    options: []
  };

  @Output() selectOption = new EventEmitter<any>();

  select(value: any) {
    this.selectOption.emit(value);
    this.optionsShown = false;
    return true;
  }
}

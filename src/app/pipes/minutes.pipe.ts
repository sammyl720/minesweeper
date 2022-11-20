import { Pipe, PipeTransform } from '@angular/core';

/**
 * Expects seconds as input and return minutes as `mm:ss`
 */
@Pipe({
  name: 'minutes'
})
export class MinutesPipe implements PipeTransform {

  transform(value: number): string {
    let seconds: number | string = value % 60;
    let minutes = (value - seconds) / 60;

    minutes = minutes >= 0 ? minutes : 0;

    if (!seconds && !minutes) {
      return '';
    }

    if (!seconds) {
      seconds = '00';
    } else if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

}

import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { ReplaySubject, sample, Subscription, switchMap, timer } from 'rxjs';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective implements OnDestroy {
  /**
   * Long press time in milleseconds
   */
  @Input() ms = 500;

  @Output() longPress = new EventEmitter<void>();

  @HostListener('touchstart') touchStart() {
    console.log('press start')
    this.start$.next();
  }

  @HostListener('touchend') touchEnd() {
    console.log('press end')
    this.end$.next();
  }

  start$ = new ReplaySubject<void>(1);
  end$ = new ReplaySubject<void>(1);

  subscription: Subscription;

  constructor(
  ) {
    this.subscription = this.start$.pipe(
      switchMap(() => timer(this.ms)),
      sample(this.end$),
    ).subscribe(() => {
      this.longPress.emit();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

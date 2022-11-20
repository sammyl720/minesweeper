import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output } from '@angular/core';
import { filter, fromEvent, map, Subscription } from 'rxjs';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective implements OnDestroy {
  @Input() excludeSelectors = '';
  @Output() clickOutSide = new EventEmitter<void>();
  subscription: Subscription;

  constructor(
    private host: ElementRef,
    @Inject(DOCUMENT) document: Document
  ) {
    this.subscription = fromEvent(document.body, 'click').pipe(
      map((event: Event) => {
        let target = event.target;
        let excludedTargets = !!this.excludeSelectors ? Array.from(document.querySelectorAll<HTMLElement>(this.excludeSelectors)) : [];
        if (!(target instanceof HTMLElement)) {
          return null;
        }

        while (target != document.body && (target instanceof HTMLElement)) {
          if (target == this.host.nativeElement || excludedTargets.includes(target)) {
            return null;
          }

          target = (target as HTMLElement).parentElement
        }

        return target;
      }),
      filter(target => !!target)
    ).subscribe(target => {
      this.clickOutSide.emit();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

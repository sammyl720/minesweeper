import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, interval, map, raceWith, ReplaySubject, startWith, Subject, Subscription, switchMap, tap, timer, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastTime = 5000;
  private toasts: string[] = [];
  currentToast$ = new ReplaySubject<string | null>(1);
  lastToast$ = new BehaviorSubject<string>('');
  clearToast$ = new Subject<void>();
  subscription: Subscription;

  constructor() {
    this.subscription = interval(50).pipe(
      withLatestFrom(this.currentToast$.pipe(startWith(null))),
      filter(([_, current]) => {
        return !current;
      }),
      map(() => {
        if (!!this.toasts.length) {
          return this.toasts.pop()
        }
        return null
      }),
      filter((newToast): newToast is string => !!newToast),
      tap(newToast => {
        this.currentToast$.next(newToast);
        this.lastToast$.next(newToast);
      }),
      switchMap(newToast => {
        return timer(this.toastTime).pipe(
          raceWith(this.clearToast$),
          map(() => newToast)
        )
      })
    ).subscribe((toast) => {
      this.currentToast$.next(null);
    })
  }

  addToast(message: string) {
    this.toasts.unshift(message);
  }

  clearToast() {
    this.clearToast$.next();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

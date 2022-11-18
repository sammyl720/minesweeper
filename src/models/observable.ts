export interface IObserver<T> {
  update: (subject: T) => void;
}

export interface IObservable<T> {
  subscribe: (observer: IObserver<T>) => void;
  unsubscribe: (observer: IObserver<T>) => void;
}

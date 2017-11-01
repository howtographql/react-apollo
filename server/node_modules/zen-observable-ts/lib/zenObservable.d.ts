import { ZenObservable } from './types';
export { ZenObservable };
export declare type Observer<T> = ZenObservable.Observer<T>;
export declare type Subscriber<T> = ZenObservable.Subscriber<T>;
export declare type ObservableLike<T> = ZenObservable.ObservableLike<T>;
export declare class Subscription implements ZenObservable.Subscription {
    _observer?: ZenObservable.Observer<any>;
    _cleanup: () => void;
    constructor(observer: ZenObservable.Observer<any>, subscriber: ZenObservable.Subscriber<any>);
    readonly closed: boolean;
    unsubscribe(): void;
}
export declare class SubscriptionObserver<T> implements ZenObservable.SubscriptionObserver<T> {
    private _subscription;
    constructor(subscription: Subscription);
    readonly closed: boolean;
    next(value: T): void;
    error(value: T): void;
    complete(): void;
}
export default class Observable<T> {
    private _subscriber;
    static from<R>(observable: Observable<R> | ZenObservable.ObservableLike<R> | ArrayLike<R>): Observable<R>;
    static of<R>(...items: R[]): Observable<R>;
    constructor(subscriber: ZenObservable.Subscriber<T>);
    subscribe(observerOrNext: ((value: T) => void) | ZenObservable.Observer<T>, error?: (error: any) => void, complete?: () => void): ZenObservable.Subscription;
    forEach(fn: (value: T) => void): Promise<void>;
    map<R>(fn: (value: T) => R): Observable<R>;
    filter(fn: (value: T) => boolean): Observable<T>;
    reduce<R = T>(fn: (previousValue: R | T, currentValue: T) => R | T, initialValue?: R | T): Observable<R | T>;
    flatMap<R>(fn: (value: T) => ZenObservable.ObservableLike<R>): Observable<R>;
}

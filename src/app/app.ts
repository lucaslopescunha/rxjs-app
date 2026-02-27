import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, min, skip } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('rxjs-app');
  private desttroyRef = inject(DestroyRef);
  paragraphClass = signal<string>('#48a160');
  interval = signal(0);
  doubleInterval = () => this.interval() * 2;
  clickCount = signal(0);

  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, {initialValue: 0});
  /**
   * $ means it is an Observable
   */
  clickCount$ = toObservable(this.clickCount);
  constructor() {
  }

  ngOnInit(): void {
    setInterval(() => {
      this.interval.update(prev => prev + 1);
    }, 1000)
    const subscribeColor = interval(2000)
      .pipe(
        map(val => {
          let randomNumber = Math.random();
          return randomNumber;
        })
      ).subscribe(randomNumber => {
          if(randomNumber < 0.3) {
            this.paragraphClass.set('#48a160');
          } else if(randomNumber < 0.7) {
            this.paragraphClass.set('#4863a1');
          } else {
            this.paragraphClass.set('#a16448');
          }

      });
    /** You can use a simple function here because you're only using "next"
        interval(1000).subscribe({
          next: (val) => console.log(val)
        }); 
        
        */
    const subscription = this.clickCount$.subscribe( (val) => {
      console.log(`Clicked button ${this.clickCount()} times.`)
    });

    this.desttroyRef.onDestroy(() => {
      /**
       * Cleaning up the subscription
       */
      subscribeColor.unsubscribe();
      subscription.unsubscribe();
    });
  }
  onClick() {
    this.clickCount.update((val) => val + 1);
  }
}

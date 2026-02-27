import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { interval, map, min, skip } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('rxjs-app');
  private desttroyRef = inject(DestroyRef);
  clickCount = signal(0);
  paragraphClass = signal<string>('#48a160');

  constructor() {
    effect(() => {
      console.log(`clicked button ${this.clickCount()}`)
    })

  }

  ngOnInit(): void {
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
    const subscription = interval(1000)
      /**
       * Pipe is somewhat like streams in java.
       */
      .pipe(
        /**
         * chaining. Start after number 10.
         */
        skip(10),
        /**
         * Map passes each source value through a transformation 
         * function to get corresponding output values
         */
        map((val) => val * 2)
      )
      .subscribe(
        (val) => console.log(val)
      );

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

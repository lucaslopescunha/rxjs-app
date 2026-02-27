import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('rxjs-app');
  private desttroyRef = inject(DestroyRef);
  ngOnInit(): void {
/** You can use a simple function here because you're only using "next"
    interval(1000).subscribe({
      next: (val) => console.log(val)
    }); */
    const subscription = interval(1000).subscribe(
      (val) => console.log(val)
    );

    this.desttroyRef.onDestroy(() => {
      /**
       * Cleaning up the subscription
       */
      subscription.unsubscribe();
    });
  }
}

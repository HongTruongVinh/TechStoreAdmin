import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CountUp } from 'countup.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-count-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './count-up.component.html',
  styleUrl: './count-up.component.scss'
})
export class CountUpComponent {
  @Input() endVal = 0;
  @Input() startVal = 0;
  @Input() duration = 2;
  @ViewChild('counter', { static: true }) counter!: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    if (this.counter) {
      const countUp = new CountUp(this.counter.nativeElement, this.endVal, {
        startVal: this.startVal,
        duration: this.duration
      });
      countUp.start();
    }
  }
}

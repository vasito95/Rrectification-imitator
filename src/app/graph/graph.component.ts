import {Component, AfterViewInit, OnInit} from '@angular/core';
import * as CanvasJS from '../../assets/canvasjs.min';
import {FirebaseService} from '../services/firebase.service';
import {interval, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  temperatureDataPoints: { y: number, x: number }[] = [];
  temperatureCurrentValue: number;
  temperatureXAxisValue = 0;
  temperatureTarget = 500;
  temperatureChart;
  systemProcessing: Subscription;

  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    this.firebaseService.temperatureCurrentOutRef.valueChanges().subscribe(value => this.temperatureCurrentValue = value);
    this.temperatureChart = new CanvasJS.Chart('chartContainer', {
      exportEnabled: true,
      title: {
        text: 'Температура'
      },
      animationEnabled: true,
      data: [{
        type: 'spline',
        markerSize: 0,
        dataPoints: this.temperatureDataPoints,
      }]
    });
    this.runSystemCalculations();
  }

  runSystemCalculations(): void {
    this.systemProcessing = interval(1000).subscribe(value => {
      console.log(this.temperatureCurrentValue);
      if (!this.temperatureCurrentValue) {
        return;
      }
      const difference = this.temperatureTarget - this.temperatureCurrentValue;
      if (Math.abs(difference) > this.temperatureTarget / 500) {
        this.temperatureCurrentValue += Math.sign(difference) * (Math.log10(Math.abs(difference)) / 5);
      } else {
        this.temperatureCurrentValue = this.temperatureTarget;
      }
      this.temperatureDataPoints.push({y: this.temperatureCurrentValue, x: this.temperatureXAxisValue});
      this.temperatureXAxisValue++;
      console.log(this.temperatureDataPoints.length);
      if (this.temperatureDataPoints.length > 30) {
        this.temperatureDataPoints.shift();
      }
      this.temperatureChart.render();
      if (this.temperatureCurrentValue !== this.temperatureTarget) {
        this.firebaseService.updateCurrent(this.temperatureCurrentValue);
      }
    });
  }
}

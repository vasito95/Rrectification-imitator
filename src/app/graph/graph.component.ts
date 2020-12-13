import {Component, OnInit} from '@angular/core';
import * as CanvasJS from '../../assets/canvasjs.min';
import {FirebaseService} from '../services/firebase.service';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  temperatureDataPoints: { y: number, x: number }[] = [];
  temperatureCurrentValue: number;
  temperatureXAxisValue = 0;
  temperatureTarget: number;
  temperatureChart;
  flowDataPoints: { y: number, x: number }[] = [];
  flowCurrentValue: number;
  flowXAxisValue = 0;
  flowTarget: number;
  flowChart;
  systemProcessing: Subscription;

  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    this.firebaseService.temperatureCurrentOutRef.valueChanges().subscribe(
      value => this.temperatureCurrentValue = value,
      error => this.temperatureCurrentValue = 0
    );
    this.firebaseService.temperatureTargetRef.valueChanges().subscribe(
      value => this.temperatureTarget = value,
      error => this.temperatureTarget = 0
    );
    this.firebaseService.flowCurrentOutRef.valueChanges().subscribe(
      value => this.flowCurrentValue = value,
      error => this.flowCurrentValue = 0
    );
    this.firebaseService.flowTargetRef.valueChanges().subscribe(
      value => this.flowTarget = value,
      error => this.flowTarget = 0
    );
    this.temperatureChart = new CanvasJS.Chart('temperatureChartContainer', {
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
    this.flowChart = new CanvasJS.Chart('flowChartContainer', {
      exportEnabled: true,
      title: {
        text: 'Витрата на виході'
      },
      animationEnabled: true,
      data: [{
        type: 'spline',
        markerSize: 0,
        dataPoints: this.flowDataPoints,
      }]
    });
    this.runSystemCalculations();
  }

  runSystemCalculations(): void {
    this.systemProcessing = interval(1000).subscribe(value => {
      this.calculateTemperature();
      this.calculateFlow();
    });
  }

  calculateTemperature(): void {
    if (!this.temperatureCurrentValue) {
      return;
    }
    const difference = this.temperatureTarget - this.temperatureCurrentValue;
    if (Math.abs(difference) > this.temperatureTarget / 200) {
      this.temperatureCurrentValue += Math.sign(difference) * (Math.log10(Math.abs(difference)) / 5);
    } else {
      this.temperatureCurrentValue = this.temperatureTarget;
    }
    this.temperatureDataPoints.push({y: this.temperatureCurrentValue, x: this.temperatureXAxisValue});
    this.temperatureXAxisValue++;
    if (this.temperatureDataPoints.length > 50) {
      this.temperatureDataPoints.shift();
    }
    this.temperatureChart.render();
    this.flowChart.render();
    if (this.temperatureCurrentValue !== this.temperatureTarget) {
      this.firebaseService.updateCurrentTemperature(this.temperatureCurrentValue);
    }
  }

  calculateFlow(): void {
    if (!this.flowCurrentValue) {
      return;
    }
    const difference = this.flowTarget - this.flowCurrentValue;
    if (Math.abs(difference) > this.flowTarget / 200) {
      this.flowCurrentValue += Math.sign(difference) * (Math.log10(Math.abs(difference) + 1) / 5);
    } else {
      this.flowCurrentValue = this.flowTarget;
    }
    this.flowDataPoints.push({y: this.flowCurrentValue, x: this.flowXAxisValue});
    this.flowXAxisValue++;
    if (this.flowDataPoints.length > 50) {
      this.flowDataPoints.shift();
    }
    this.flowChart.render();
    if (this.flowCurrentValue !== this.flowTarget) {
      this.firebaseService.updateCurrentFlow(this.flowCurrentValue);
    }
  }
}

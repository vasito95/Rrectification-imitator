import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {

  constructor(private firebaseService: FirebaseService) {
  }

  temperatureCurrentValue: number;
  flowCurrentValue: number;

  ngOnInit(): void {
    this.firebaseService.temperatureCurrentOutRef.valueChanges().subscribe(
      value => this.temperatureCurrentValue = value,
      error => this.temperatureCurrentValue = 0
    );
    this.firebaseService.flowCurrentOutRef.valueChanges().subscribe(
      value => this.flowCurrentValue = value,
      error => this.flowCurrentValue = 0
    );
  }

}

import { Component, OnInit } from '@angular/core';
import {RectificationColumnModel} from '../model/rectification_column_model';
import {FirebaseService} from '../services/firebase.service';
import {MatSliderChange} from '@angular/material/slider';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {
  data: RectificationColumnModel;

  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    this.firebaseService.dataRef.valueChanges().subscribe(newData => {
      this.data = newData;
    });
  }

  onValve1Changed(valveValue: MatSliderChange): void {
    const column = new RectificationColumnModel(
      valveValue.value,
      this.data.valve2,
      this.data.temp1,
      this.data.temp2,
    );
    this.firebaseService.updateData(column).then(value => this.data = column);
  }

  onValve2Changed(newValue: MatSliderChange): void {
    const column = new RectificationColumnModel(
      this.data.valve1,
      newValue.value,
      this.data.temp1,
      this.data.temp2,
    );
    this.firebaseService.updateData(column).then(value => this.data = column);
  }

  onTemp1Changed(newValue: MatSliderChange): void {
    const column = new RectificationColumnModel(
      this.data.valve1,
      this.data.valve2,
      newValue.value,
      this.data.temp2,
    );
    this.firebaseService.updateData(column).then(value => this.data = column);
  }

  onTemp2Changed(newValue: MatSliderChange): void {
    const column = new RectificationColumnModel(
      this.data.valve1,
      this.data.valve2,
      this.data.temp1,
      newValue.value,
    );
    this.firebaseService.updateData(column).then(value => this.data = column);
  }

}

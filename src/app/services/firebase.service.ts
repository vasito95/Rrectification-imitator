import {Injectable} from '@angular/core';

import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {RectificationColumnModel} from '../model/rectification_column_model';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  dataRef: AngularFireObject<RectificationColumnModel>;
  temperatureTargetRef: AngularFireObject<any>;
  temperatureCurrentOutRef: AngularFireObject<any>;
  flowCurrentOutRef: AngularFireObject<any>;
  flowTargetRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
  }

  getData(): void {
    this.dataRef = this.db.object('data');
    this.temperatureTargetRef = this.db.object('targetTemperature');
    this.temperatureCurrentOutRef = this.db.object('currentTemperatureOut');
    this.flowCurrentOutRef = this.db.object('flowCurrentOut');
    this.flowTargetRef = this.db.object('targetFlow');
  }

  initTargetProcessing(): void {
    this.dataRef.valueChanges().subscribe(value => {
      this.db.database.ref('targetFlow').transaction(_ => 0.20 * ((value.valve1 * value.valve2) * 0.00016));
      this.db.database.ref('targetTemperature').transaction(_ => 80 * ((value.valve1 * value.valve2) * 0.00010625));
    });
  }

  updateData(data: RectificationColumnModel): Promise<void> {
    return this.dataRef.update({
      valve1: data.valve1,
      valve2: data.valve2,
      temp1: data.temp1,
      temp2: data.temp2,
    });
  }

  updateCurrentTemperature(currentTemperatureOut: number): Promise<void> {
    return this.db.database.ref().update({currentTemperatureOut});
  }

  updateCurrentFlow(flowCurrentOut: number): Promise<void> {
    return this.db.database.ref().update({flowCurrentOut});
  }

  updateTemperatureTarget(targetTemperature: number): Promise<void> {
    return this.db.database.ref().update({targetTemperature});
  }

  updateFlowTarget(targetFlow: number): Promise<void> {
    return this.db.database.ref().update({targetFlow});
  }
}




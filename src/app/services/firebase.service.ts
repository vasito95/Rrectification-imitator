import {Injectable} from '@angular/core';

import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {RectificationColumnModel} from '../model/rectification_column_model';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  dataRef: AngularFireObject<any>;
  temperatureTargetRef: AngularFireObject<any>;
  temperatureCurrentOutRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
  }

  getData(): void {
    this.dataRef = this.db.object('data');
    this.temperatureTargetRef = this.db.object('targetTemperature');
    this.temperatureCurrentOutRef = this.db.object('currentTemperatureOut');
  }

  updateData(data: RectificationColumnModel): Promise<void> {
    return this.dataRef.update({
      valve1: data.valve1,
      valve2: data.valve2,
      temp1: data.temp1,
      temp2: data.temp2,
    });
  }
  updateCurrent(currentOut: number): Promise<void> {
    return this.db.database.ref().update({currentOut});
  }
}




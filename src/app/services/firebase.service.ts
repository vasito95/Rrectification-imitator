import {Injectable} from '@angular/core';

import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  volumeRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
  }

  getVolume(): void {
    this.volumeRef = this.db.object('volume');
  }

  updateVolume(volume: number): Promise<void> {
    return this.db.database.ref().update({volume});
  }
}




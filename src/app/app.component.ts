import {Component, OnInit} from '@angular/core';
import {FirebaseService} from './services/firebase.service';
import {MatSliderChange} from '@angular/material/slider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'rectification';
  value = 0;
  constructor(private firebaseService: FirebaseService){}

  ngOnInit(): void {
    this.firebaseService.getVolume();
    this.firebaseService.volumeRef.valueChanges().subscribe(data => {
      this.value = data;
    });
  }

  onVolumeChanged(volume: MatSliderChange): void {
    console.log(volume);
    this.firebaseService.updateVolume(volume.value);
  }
}

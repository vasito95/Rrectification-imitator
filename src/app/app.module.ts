import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule, Routes } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { GraphComponent } from './graph/graph.component';
import { ControlComponent } from './control/control.component';
import { ParametersComponent } from './parameters/parameters.component';
import { ChartsComponent } from './charts/charts.component';
import {ChartModule} from '@syncfusion/ej2-angular-charts';
import {MatSidenavModule} from '@angular/material/sidenav';
const routes: Routes = [
  {path: 'control', component: ControlComponent},
  {path: 'graphs', component: GraphComponent},
  {path: 'parameters', component: ParametersComponent},
  {path: '',   redirectTo: '/control', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    ControlComponent,
    ParametersComponent,
    ChartsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatTabsModule,
    MatSidenavModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes),
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicCameraApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera } from '@ionic-native/camera';
import { CameraPreview } from '@ionic-native/camera-preview';
import { File } from '@ionic-native/file';
import { Dialogs } from '@ionic-native/dialogs';


@NgModule({
  declarations: [
    IonicCameraApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(IonicCameraApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    IonicCameraApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AndroidPermissions,
    Diagnostic,
    Camera,
    CameraPreview, 
    File,
    Dialogs
  ]
})
export class AppModule {}

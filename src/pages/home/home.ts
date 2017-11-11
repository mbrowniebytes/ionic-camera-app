import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Platform} from 'ionic-angular';

import { AndroidPermissions } from '@ionic-native/android-permissions';
// import { Camera } from '@ionic-native/camera';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { File } from '@ionic-native/file';
import { Dialogs } from '@ionic-native/dialogs';

// declare var cordova: any; // global variable for paths

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage { 

  public picture: string;
  public pictureHeight: number;

  constructor(public navCtrl: NavController, 
    public toastCtrl: ToastController,
    public platform:Platform,
    public androidPermissions: AndroidPermissions,
    public cameraPreview: CameraPreview,
    public file: File,
    public dialogs: Dialogs) 
  {

  }

  ionViewDidLoad() 
  {
    if (this.platform.is('cordova')) {
      this.checkPermissions();
    }

    this.picture = "data:image/png;base64,"+"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkCP9fDwADjAHXR9/c5AAAAABJRU5ErkJggg==";
    this.pictureHeight = Math.floor(window.screen.height / 2) - 55;
  }

  ionViewWillUnload() 
  {
    this.cameraPreview.stopCamera();
  }

  private checkPermissions() 
  {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      success =>{
         console.log('checkPermission granted');
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );
    
    try {
      if (this.androidPermissions.hasPermission) {
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]).then(
          success =>{
             console.log('requestPermissions granted');
     
             this.initializePreview();
          });
      } else {
        this.dialogs.alert("Missing permission to use the Camera");
        this.platform.exitApp();
      }
    } catch(e) {
      console.log(e); 
      this.dialogs.alert(e.message);
      this.platform.exitApp();
    }
  }

  private initializePreview() {

    // camera options (Size and location). In the following example, the preview uses the rear camera and display the preview in the back of the webview
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: Math.floor(window.screen.height / 2),
      width: window.screen.width,
      height: Math.floor(window.screen.height / 2),
      camera: "rear",
      tapPhoto: true,
      previewDrag: false,
      toBack: true,
      alpha: 1
    };

    // start camera preview  
    console.log('Starting preview camera');
    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {        
        console.log('Started preview camera; ', res);
      },
      (err) => {
        if (err == "Camera already started") {
          // ok 
        } else {
          console.log('Error starting preview camera; ', err);
          this.dialogs.confirm("Unable to initialize Camera Preview. Try again?").then(
            (btn) => {
              if (btn == 1) { // ok
                this.checkPermissions();
              } else { // 0 outside prompt or 2 cancel
                this.platform.exitApp();
              }
            }
          );
        }
      });

  }

  public takePicture() {
    // picture options
    const pictureOpts: CameraPreviewPictureOptions = {
      width: 1280,
      height: 1280,
      quality: 85
    }
          // destinationType: CameraPreview.DestinationType.DATA_URL
      // destinationType: Camera.DestinationType.FILE_URI

    // take a picture
    console.log('Taking picture from preview camera');
    try {
      this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
        this.picture = "data:image/jpeg;base64," + imageData;

        // this.moveFileToExternalStorage(result[0]); // Move picture only

      }, (err) => {
        console.log("Error taking picture from preview camera; ", err);
        this.picture = "data:image/png;base64," + "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8b8FQDwAFLQG463LdcAAAAABJRU5ErkJggg==";
      });
    } catch (e) {
      console.log(e);
      this.dialogs.alert(e.message);     
    }
  }

  public changeEffect() {
    // Create an array with 5 effects
    let effects: any = ['none', 'negative','mono', 'aqua', 'sepia'];
 
    let randomEffect: string = effects[Math.floor(
                                Math.random() * effects.length)];
    this.cameraPreview.setColorEffect(randomEffect);
  }

  // private moveFileToExternalStorage(fileName: string) {
  //   // Determine paths
  //   let externalStoragePath: string = 
  //               cordova.file.externalApplicationStorageDirectory;
  //   let currentPath: string = 
  //               cordova.file.applicationStorageDirectory + "files/";
 
  //   // Extract filename
  //   fileName = fileName.split("/").pop();
 
  //   console.log("moveFileToExternalStorage", currentPath, fileName,
  //     externalStoragePath, fileName);

  //   // Move the file
  //   this.file.moveFile(currentPath, fileName,
  //                 externalStoragePath, fileName).then(_ => {
  //       this.toastCtrl.create(
  //           {
  //               message: "Saved one photo", 
  //               position: "bottom",
  //               duration: 2000
  //           }
  //       ).present();
  //     });
  //   }
}

import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as Enums from '../enums/enums';
import 'rxjs/add/operator/map';

/**
 * Generated class for the StatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {

  accout: any = [];
  parent: any = [];
  edit: boolean = false;
  latitudeNull = null;
  longitudeNull = null;
  latitude: any = [];
  longitude: any = [];
  interval: number;
  status;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public http: HttpClient, public alertCtrl: AlertController, private Storage: Storage, private geolocation: Geolocation) {
    this.loaddata();
    Storage.ready().then(()=>{
      Storage.get('edit').then((val)=>{
        this.edit = val;
        console.log(val);

        if(val==true){


          this.status="กำลังเปิดสถานะ"
        }
        else if (val==false){


          this.status=null
        }
        else{

        }
      })
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');
  }

  loaddata() {
    this.Storage.get('accoutuser').then((data) => {
      this.accout = data;
      console.log(data);
      let url = Enums.APIURL.URL + '/todoslim3/public/index.php/parentall/user=' + this.accout.par_user + '&&' + 'pass=' + this.accout.par_password;
      this.http.get(url).subscribe(user => {
        this.parent = user;
        console.log(user);
      });
    })
  }

  mode() {
    if (this.edit == true) {
      const confirm = this.alertCtrl.create({
        title: 'คุณต้องเปิดโหมดรับบุตรหรือไม่',
        buttons: [{
          text: 'ตกลง',
          handler: () => {
            this.status = "กำลังเปิดสถานะ"
            this.interval = setInterval(() => {
              this.geolocation.getCurrentPosition().then((resp) => {
                resp.coords.latitude
                resp.coords.longitude
                this.latitude = resp.coords.latitude;
                this.longitude = resp.coords.longitude;
                let url = Enums.APIURL.URL + '/todoslim3/public/index.php/editparentlatlong/' + this.parent.par_id + '&&' + this.latitude + '&&' + this.longitude;
                this.http.get(url).subscribe(data => {
                  this.accout = data;
                  this.loaddata();
                })
              }).catch((error) => {
                console.log('Error getting location', error);
              });
            }, 10000)
            this.loaddata();
          }
        },
        {
          text: 'ยกเลิก',
          handler: () => {
            if (this.edit == false) {
              this.edit = true;
            } else {
              this.edit = false;
            }
          }
        }
        ]
      });
      confirm.present();
    } else {
      const confirm = this.alertCtrl.create({
        title: 'คุณต้องปิดโหมดรับบุตรหรือไม่',
        buttons: [{
          text: 'ตกลง',
          handler: () => {
            this.status = null
            clearInterval(this.interval);
            setTimeout(() => {
              let url = Enums.APIURL.URL + '/todoslim3/public/index.php/editparentlatlongNull/' + this.parent.par_id + '&&' + this.latitudeNull + '&&' + this.longitudeNull;
              this.http.get(url).subscribe(data => {
                this.accout = data;
              })
            }, 3000)
            this.loaddata();
          }
        },
        {
          text: 'ยกเลิก',
          handler: () => {
            if (this.edit == false) {
              this.edit = true;
            } else {
              this.edit = false;
            }
          }
        }
        ]
      });
      confirm.present();



    }
    this.Storage.set('edit', this.edit);
  }

  //end
}

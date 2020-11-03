import { StatusPage } from './../status/status';
import { Geolocation } from '@ionic-native/geolocation';
import { EditparentPage } from './../editparent/editparent';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import * as Enums from '../enums/enums';

/**
 * Generated class for the ParentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parent',
  templateUrl: 'parent.html',
})
export class ParentPage {

  accout: any = [];
  parent: any = [];
  edit: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public http: HttpClient, public alertCtrl: AlertController, private Storage: Storage, private geolocation: Geolocation) {
    this.loaddata();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParentPage');

  }

  mainparent() {
    this.navCtrl.push(EditparentPage);
  }

  status(){
    this.navCtrl.push(StatusPage);
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

  logout() {
    const confirm = this.alertCtrl.create({
      title: 'คุณต้องการออกจากระบบหรือไม่',
      buttons: [{
        text: 'ตกลง',
        handler: () => {
          this.Storage.remove('accoutuser');
          this.navCtrl.setRoot(HomePage);
        }
      },
      {
        text: 'ยกเลิก',
        handler: () => { }
      }
      ]
    });
    confirm.present();

  }

  //end
}

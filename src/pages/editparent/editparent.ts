import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import * as Enums from '../enums/enums';

/**
 * Generated class for the EditparentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editparent',
  templateUrl: 'editparent.html',
})
export class EditparentPage {

  accout: any = [];
  parent: any = [];
  title2:  any=['นางสาว','นาง','นาย'];
  edit: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private Storage: Storage, public http: HttpClient, public alertCtrl: AlertController) {
    this.loaddata();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditparentPage');
    this.loaddata();
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

  ionViewDidLeave() {
    this.edit = false;
    this.dorefres();
  }

  editAccount() {
    let url = Enums.APIURL.URL + '/todoslim3/public/index.php/editparent/' + this.parent.par_id + '&&' + this.parent.par_title + '&&' + this.parent.par_name + '&&' + this.parent.par_sname + '&&' + this.parent.par_tel;
    this.http.get(url).subscribe(data => {
      this.accout = data;
      if (data != false) {
        const alert = this.alertCtrl.create({
          title: 'ยืนยันการแก้ไขข้อมูล',
          buttons: [{
            text: 'ตกลง',
            handler: () => {
              this.edit = false
              this.dorefres();
            }
          },
          {
            text: 'ยกเลิก',
            handler: () => { }
          }
          ]
        })
        alert.present();
      } else {

      }
    })
  }


  dorefres() {
    setTimeout(() => {
      this.ionViewDidLoad();
    }, 500)
  }

}

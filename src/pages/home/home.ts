import { ParentPage } from './../parent/parent';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import * as Enums from '../enums/enums';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public login:FormGroup;

  constructor(public navCtrl: NavController, public NavParams: NavParams,
              public FormBuilder: FormBuilder, public http: HttpClient,
              public LoadingCtrl: LoadingController, public alertCtrl: AlertController,
              private Storage: Storage
              ) {

                this.login = this.FormBuilder.group({
                  par_user: ['', Validators.required],
                  par_password: ['', Validators.required]
                });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter(){
    this.Storage.get('accoutuser').then((val) => {
      if(val != null){
        const loader = this.LoadingCtrl.create({
          content: "Please wait........",
          duration: 500,
        });
        this.navCtrl.setRoot(ParentPage,val);
        loader.present();
      }else{
         // this.navCtrl.setRoot(HomePage);
      }

      console.log('Your age is', val);
    });

  }

  doLogin(){
    console.log(this.login.value);
    console.log(this.login.valid);
  }

  logincheck(par_user,par_password){




    console.log("par_user", this.login.value.par_user);
    console.log("par_password", this.login.value.par_password);
    let url = Enums.APIURL.URL + '/todoslim3/public/index.php/parLogin/user='+this.login.value.par_user+'&&'+'pass='+this.login.value.par_password;
    this.http.get(url).subscribe((data:any={})=>{



      let account = {
        par_id:data['par_id'],
        par_user:data['par_user'],
        par_password:data['par_password']
      }
      if(data != false){
        console.log(data);
        const loader = this.LoadingCtrl.create({
          content: "Pleas  wait.....",
          duration: 500,
        });
        loader.present();
        this.Storage.set('accoutuser',account);
        this.navCtrl.setRoot(ParentPage,par_user,par_password);
      //  this.storage.ready().then(()=>{
      //  this.storage.set('accoutuser',account)
      //});

      }else if(data == false){
       let alert = this.alertCtrl.create({
         message: "รหัสผู้ใช้ หรือ พาสเวิร์ด ไม่ถูกต้อง",
         buttons: [
           {
            cssClass: 'secondary',
            text: 'Ok',
            role: 'OK'
           }
         ]
       });
       alert.present();
       this.login.value.par_user = "";
       this.login.value.par_password = "";
      }

    });
  }
}

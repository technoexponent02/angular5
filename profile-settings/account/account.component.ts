import { Component, OnInit } from '@angular/core';

import { CommonService } from './../../api/common.service';
import { ProfileSettingService } from './../../api/profile-setting.service';
import { DataService } from './../../api/data.service';

import { Message } from 'primeng/primeng';

declare var $: any;
declare var moment: any;


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  msgs: Message[] = [];

  /**
   * @property \{{{any}}\} {{authUser}} {{this will store authuser data}}
   */
  authUser: any = {};

  /**
   * @property \{{{any}}\} {{editBtn}} {{this will make the edit and save btn state}}
   */
  editBtn: any = true;

  /**
   * @property \{{{any}}\} {{loading}} {{this will make the button state and loading}}
   */
  loading: any = false;

  /**
   * @property \{{{any}}\} {{userSettings3}} {{this will make ng4 auto compleate selected from first}}
   */
  userSettings3: any = {
    'inputString': ''
  };



  /**
   * @constructor
   * @description {{DI will be pushed here}}
   */
  constructor(
    private profileSettingService: ProfileSettingService,
    private commonService: CommonService,
    private hdata: DataService
  ) { }


  /**
   * @func {{updatedAuth}}
   * @description {{this will send message as updated auth}}
   */
  updatedAuth() {
    this.hdata.updateAuth('update auth');
  }



  /**
   * @func {{makeEdit}}
   * @description {{this will make edit btn true active and inactive}}
   */
  makeEdit() {
    // active the edit mode
    this.editBtn = false;
  }

  /**
   * @func {{makeSave}}
   * @description {{this will make save the changes in the account}}
   */
  makeSave() {
    // toggle  button loading state
    this.loading = true;

    // assign the location data
    this.userSettings3['inputString'] = this.authUser.location;
    this.userSettings3 = Object.assign({}, this.userSettings3);

    // make the local obj
    const makeTheLocalObj =  {
      first_name: this.authUser.first_name,
      last_name: this.authUser.last_name,
      latitude: this.authUser.latitude,
      longitude: this.authUser.longitude,
      location: this.authUser.location,
      about_me: this.authUser.about_me,
      phone: this.authUser.phone,
      date_of_birth: moment(this.authUser.date_of_birth).format('YYYY-MM-DD'),
      username: this.authUser.username
    };

    // api call
    this.commonService.aboutEdit(makeTheLocalObj, this.authUser.api_token)
      .subscribe(
        (data: any) => {
          // set the data to the localstorage
          localStorage.setItem('meraDetails', JSON.stringify(data.user));
          // make call on init again
          this.ngOnInit();

          // toggle  button loading state
          this.loading = false;

          // make read only after save
          this.editBtn = true;

          // make update auth
          this.updatedAuth();
        },
        err => {
          console.log(err);

          // give user message
          if (err.error.errors.username) {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: '', detail: err.error.errors.username[0]});
          } else {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: '', detail: 'Please fill the form correctly'});
          }

          // toggle  button loading state
          this.loading = false;

          // make read only after save
          this.editBtn = true;

          setTimeout(() => {
            // give user message
            this.msgs = [];
            // get the old data again
            this.ngOnInit();
          }, 2000);
        }
      );

  }



  /**
   * @function {{autoCompleteCallback1}}
   * @description {{this is used for location auto complete}}
   */
  autoCompleteCallback1(selectedData: any) {
    // console.log(selectedData);
    this.authUser.location = selectedData;
    // console.log(this.authUser.location);
    if (this.authUser.location.response !== false) {
      this.authUser.latitude = this.authUser.location.data.geometry.location.lat;
      this.authUser.longitude = this.authUser.location.data.geometry.location.lng;
      this.authUser.location = this.authUser.location.data.formatted_address;
    }
  }




  /**
   * @func {{ngOnInit}}
   * @description {{this is lifecycle hook}}
   */
  ngOnInit() {

    // get auth user
    this.authUser = this.commonService.getAuthUser();
    // make date as per datepicker
    this.authUser.date_of_birth = moment(this.authUser.date_of_birth)._d;

    this.userSettings3['inputString'] = this.authUser.location;
    this.userSettings3 = Object.assign({}, this.userSettings3);


  }

}

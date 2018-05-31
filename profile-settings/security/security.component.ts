import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonService } from './../../api/common.service';
import { ProfileSettingService } from './../../api/profile-setting.service';
import { DataService } from './../../api/data.service';

import { Message } from 'primeng/primeng';

declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
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
   * @property \{{{any}}\} {{securityModel}} {{this is the form data model}}
   */
  securityModel: any = {};



  /**
   * @constructor
   * @description {{DI will be pushed here}}
   */
  constructor(
    private profileSettingService: ProfileSettingService,
    private commonService: CommonService,
    private router: Router,
    private hdata: DataService
  ) { }


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
    this.loading = true;

    if (confirm('We will logout you. You need to login again.')) {
      // localobj
      const localobj = {
        current_password: this.securityModel.current_password,
        new_password: this.securityModel.new_password,
      };

      // api call
      this.profileSettingService.changeSecurity(this.authUser.api_token, localobj)
        .subscribe(
          (data: any) => {
            // make user loged out and open the login page
            localStorage.removeItem('meraDetails');
            this.hdata.changeLogin('not-login');
            this.router.navigate([`/login`]);
          },
          err => {
            this.loading = false;
            console.log(err);

            // give user message
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: '', detail: 'Failure to update password'});

            setTimeout(() => {
              // give user message
              this.msgs = [];
            }, 2000);
          }
        );
    } else {
      this.loading = false;
      // this.ngOnInit();
    }

  }




  /**
   * @func {{ngOnInit}}
   * @description {{this is lifecycle hook}}
   */
  ngOnInit() {

    // get auth user
    this.authUser = this.commonService.getAuthUser();

    // security  model set value
    this.securityModel = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    };



  }

}

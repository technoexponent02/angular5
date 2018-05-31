import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../_services/user.service';
import {AdminService} from '../../../_services/admin.service';

import {Message} from 'primeng/primeng'

// for jquery
declare var $: any;

@Component({
  selector: 'app-client-admin-client-setting',
  templateUrl: './client-admin-client-setting.component.html',
  styleUrls: ['./client-admin-client-setting.component.css']
})
export class ClientAdminClientSettingComponent implements OnInit {
  msgs: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{store the auth user data from the localstorage}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{configObj}} {{this will hold the configaration data}}
   */
  configObj: any = {};


  /**
   * @constructor
   * @param userService {{UserService DI}}
   * @param adminService {{AdminService DI}}
   * @description {{DI is pushed in this component constractor class}}
   */
  constructor(
    private userService: UserService,
    private adminService: AdminService
  ) {}


  /**
   * @func {{getOrgValidation}}
   * @description {{this function will get initial organaization validation data}}
   */
  private getOrgValidation(){
    this.adminService.getOrgValidationData()
      .subscribe(
        // $('.setting-http-load, .linear-progress').fadeOut();
        data => {
          $('.setting-http-load, .linear-progress').fadeOut();
          this.configObj = data.organizationparmition[0];
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{orgValidationUpdate}}
   * @description {{this will update the organaization validation changes}}
   */
  orgValidationUpdate(){
    // console.log(this.configObj)
    this.adminService.updateOrgValidationData(this.configObj)
      .subscribe(
        data => {
          this.msgs = [];
          this.msgs.push({severity:'success', summary:'Success Message', detail:'Organaization validation updated'});
          // get all organaization validation data get
          this.getOrgValidation();
        },
        error => {
          console.log(error);
          this.msgs = [];
          this.msgs.push({severity:'error', summary:'Error Message', detail:'Something went wrong!'});
        }
      );
  }

  /**
   * @func {{ngOnInit}}
   * @description {{This is on init lifecycle hook}}
   */
  ngOnInit() {
    // set the auth user and store the data in the localstorage
    this.authUser = this.userService.getAuthUser();
    // get all organaization validation data get
    this.getOrgValidation();
  }

}

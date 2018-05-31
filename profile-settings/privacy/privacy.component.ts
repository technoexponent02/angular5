import { Component, OnInit } from '@angular/core';

import { CommonService } from './../../api/common.service';
import { ProfileSettingService } from './../../api/profile-setting.service';

import { Message } from 'primeng/primeng';


@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  msgs: Message[] = [];

  /**
   * @property \{{{any}}\} {{authUser}} {{this will store authuser data}}
   */
  authUser: any = {};




  /**
   * @constructor
   * @description {{DI will be pushed here}}
   */
  constructor(
    private profileSettingService: ProfileSettingService,
    private commonService: CommonService
  ) { }



  /**
   * @func {{privacyLvlChange}}
   * @description {{this will make the change the value of privacy level}}
   */
  privacyLvlChange($data) {
    this.profileSettingService.changePrivacy(this.authUser.api_token, {
      privacy_scope: $data
    }).subscribe(
      (data: any) => {
        // set the auth data
        localStorage.setItem('meraDetails', JSON.stringify(data.user));
        // init state call
        this.ngOnInit();
      },
      err => {
        console.log(err);

        // give user message
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: '', detail: 'Failed to update privacy. Try again.'});

        // make on init call
        this.ngOnInit();

        setTimeout(() => {
          // give user message
          this.msgs = [];
        }, 2000);
      }
    );
  }



  /**
   * @func {{ngOnInit}}
   * @description {{this is lifecycle hook}}
   */
  ngOnInit() {
    // get auth user
    this.authUser = this.commonService.getAuthUser();

  }

}

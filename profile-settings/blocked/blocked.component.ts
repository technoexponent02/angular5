import { Component, OnInit } from '@angular/core';

import { CommonService } from './../../api/common.service';
import { ProfileSettingService } from './../../api/profile-setting.service';

import { Message } from 'primeng/primeng';

import { appConfig } from './../../appConfig';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.css']
})
export class BlockedComponent implements OnInit {
  msgs: Message[] = [];

  /**
   * @property \{{{any}}\} {{authUser}} {{this will store authuser data}}
   */
  authUser: any = {};

  noBkUserMsg: any = '';

  blockedUserList: any = [];

  btnstate: any = false;

  loading: any = true;

  /**
   * @property \{{{any}}\} {{profileurl}} {{this will take the profile pic upload public url}}
   */
  profileurl: any = appConfig.uploadurl;



  /**
   * @constructor
   * @description {{DI will be pushed here}}
   */
  constructor(
    private profileSettingService: ProfileSettingService,
    private commonService: CommonService
  ) { }


  /**
   * @func {{getAllBlockedFrnd}}
   * @description {{this will get all the block friend}}
   */
  getAllBlockedFrnd($token) {
    // loading added
    this.loading = true;

    // fetch start
    this.profileSettingService.getAllBlockFrnds($token)
      .subscribe(
        (bdata: any) => {
          // console.log(bdata);
          this.blockedUserList = bdata.response.data;

          // if no blocked user
          if (this.blockedUserList.length == 0) {
            this.noBkUserMsg = 'You no blocked friend';
          }


          // loading removed
          this.loading = false;
        },
        err => {
          console.log(err);
        }
      );
  }


  /**
   * @func {{mkUnblock}}
   * @description {{this will unblock the user}}
   */
  mkUnblock($data) {
    // alert(JSON.stringify($data));

    // make localobj
    const unblockObj = {
      friend_id: $data.friend.id
    };

    // post api call
    this.profileSettingService.mlUnBlock(unblockObj, this.authUser.api_token)
      .subscribe(
        (data: any) => {
          // get blocked user
          this.getAllBlockedFrnd(this.authUser.api_token);
        },
        err => {
          console.log(err);
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

    // get blocked user
    this.getAllBlockedFrnd(this.authUser.api_token);

  }

}

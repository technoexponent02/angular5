import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../../api/common.service';
import { SuggestedService } from '../../../api/suggested.service';

import { appConfig } from './../../../appConfig';

@Component({
  selector: 'app-small-widget',
  templateUrl: './small-widget.component.html',
  styleUrls: ['./small-widget.component.css']
})
export class SmallWidgetComponent implements OnInit {
/**
   * @property \{{{any}}\} {{friendList}} {{this will store the all friendlist data}}
   */
  friendList: any = [];
  friendListmsg: any = '';
  /**
   * @property \{{{any}}\} {{profileurl}} {{this is hold the profile url}}
   */
  profileurl: any = appConfig.uploadurl;
  /**
   * @property \{{{any}}\} {{loading}} {{this will hold the loading data}}
   */
  loading: any = true;
  pagival: any = 1;



  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private commonService: CommonService,
    private suggestedService: SuggestedService
  ) { }

  

  /**
   * @func {{getFriendList}}
   * @param token this will take the auth user token
   * @param pagenumber this will pass the paginator page
   * @description {{this will fetch the list of suggested friend list}}
   */
  getFriendList(token, pagenumber) {
    this.suggestedService.getFriends(token, pagenumber)
      .subscribe(
        (fdata: any) => {
          // console.log(fdata.paginated_data.data);

          // fdata.paginated_data.data.map((m) => {
          //   this.friendList.push(m);
          // });

          // alll suggested friends
          // this.friendList.push(fdata.paginated_data.data);
          if (fdata.paginated_data.data.length !== 0) {
            this.friendList = fdata.paginated_data.data;
          } else {
            this.friendListmsg = 'No suggested friend';
          }
          

          // remove loader
          this.loading = false;
        },
        err => {
          console.log(err);
          // remove loader
          this.loading = false;
        }
      );
  }


  /**
   * @func {{addfriend}}
   * @description {{this will send the add friend}}
   */
  addfriend($data) {
    // make local obj
    const localobj = {
      friend_id: $data.id,
      is_requested: 1,
      is_accepted: 3
    };

    // send the data
    this.suggestedService.sendFrndReq(this.commonService.getAuthUser().api_token, localobj)
      .subscribe(
        (data: any) => {
          console.log(data);
          // get the suggested friends call
          this.getFriendList(this.commonService.getAuthUser().api_token, this.pagival);
        },
        err => {
          console.log(err);
          // alert('Friend request sending failure');
          if (err.error.error.message.friend_id) {
            alert(err.error.error.message.friend_id[0]);
          } else {
            alert('Friend request sending failure');
          }
        }
      );
  }



  /**
   * @func {{ngOnInit}}
   * @description {{this is lifecycle hook}}
   */
  ngOnInit() {

    // get the suggested friends call
    this.getFriendList(this.commonService.getAuthUser().api_token, this.pagival);

  }

}

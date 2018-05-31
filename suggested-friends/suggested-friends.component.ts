import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../api/common.service';
import { SuggestedService } from '../../api/suggested.service';

import { appConfig } from './../../appConfig';


@Component({
  selector: 'app-suggested-friends',
  templateUrl: './suggested-friends.component.html',
  styleUrls: ['./suggested-friends.component.css']
})
export class SuggestedFriendsComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{friendList}} {{this will store the all friendlist data}}
   */
  friendList: any = [];
  friendListmsg: any = '';

  /**
   * @property \{{{any}}\} {{dataload}} {{this will load the initial data}}
   */
  dataload: any = false;

  /**
   * @property \{{{any}}\} {{profileurl}} {{this is hold the profile url}}
   */
  profileurl: any = appConfig.uploadurl;
  /**
   * @property \{{{any}}\} {{loading}} {{this will hold the loading data}}
   */
  loading: any = true;
  /**
   * @property \{{{any}}\} {{pagival}} {{this is the default pagi val}}
   */
  pagival: any = 1;
  /**
   * @property \{{{any}}\} {{inifbusy}} {{this is make inifint busy}}
   */
  inifbusy: any = false;



  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private commonService: CommonService,
    private suggestedService: SuggestedService
  ) { }



  /**
   * @func {{onScroll}}
   * @description {{this will file on scroll infinite}}
   */
  onScroll () {
    // console.log('scrolled!!');
    // busy load true
    this.inifbusy = true;
    // up the pagination val
    this.pagival = this.pagival + 1;
    // ask for next set of friend list
    this.getFriendList(this.commonService.getAuthUser().api_token, this.pagival);
  }



  /**
   * @func {{getFriendList}}
   * @param token this will take the auth user token
   * @param pagenumber this will pass the paginator page
   * @description {{this will fetch the list of suggested friend list}}
   */
  getFriendList(token, pagenumber) {
    // make loader active
    this.dataload = true;

    this.suggestedService.getFriends(token, pagenumber)
      .subscribe(
        (fdata: any) => {
          // console.log(fdata.paginated_data.data);


          if (fdata.paginated_data.data.length !== 0) {
            fdata.paginated_data.data.map((m) => {
              this.friendList.push(m);
            });
          } else {
            this.friendListmsg = 'You have no suggested friend';
          }

          

          // console.log(this.friendList)

          // alll suggested friends
          // this.friendList.push(fdata.paginated_data.data);
          // this.friendList = fdata.paginated_data.data;
          
          // make loader deactive
          this.dataload = false;

          // remove loader
          this.loading = false;
          // busy load false
          this.inifbusy = false;
        },
        err => {
          console.log(err);
          // remove loader
          this.loading = false;
          // busy load false
          this.inifbusy = false;
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


          // remove frnd
          this.friendList = this.friendList.filter((el) => {
              return el.id !== $data.id;
          });


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

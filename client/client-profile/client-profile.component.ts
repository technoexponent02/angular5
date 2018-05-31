import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../../_services/user.service';
import {AdminService} from '../../../_services/admin.service';
import {ImageuploadService} from '../../../_services/imageupload/imageupload.service';
import * as config from '../../../config';

import {Message} from 'primeng/primeng';

// for jquery
declare var $: any;

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{id}} {{this is where we store diffrent user token}}
   */
  private id;
  /**
   * @property \{{{Message[]}}\} {{msgs}} {{this will hold the all message data}}
   */
  msgs: Message[] = []
  /**
   * @property \{{{Message[]}}\} {{grawlmsgs}} {{this will hold the success message}}
   */
  grawlmsgs: Message[] = [];
  /**
   * @property \{{{any}}\} {{profileDetails}} {{this holds the authenticated user my profile data}}
   */
  profileDetails:any = [];
  /**
   * @property \{{{array}}\} {{myProfileUpdatedCheckingErrorObj}} {{my profile error list}}
   */
  myProfileUpdatedCheckingErrorObj:any = [];
  /**
   * @property \{{{any}}\} {{myProfileImageUpdateApi}} {{this will be a api url for the image upload}}
   */
  myProfileImageUpdateApi: any = '';
  /**
   * @property \{{{boolean}}\} {{noProfileImage}} {{is image present or not}}
   */
  noProfileImage:boolean = false;
  /**
   * @property \{{{any}}\} {{queryObj}} {{this will get the query data from the url}}
   */
  queryObj:any;


  /**
   * @constructor
   * @param userService {{UserService DI}}
   * @param adminService {{AdminService DI}}
   * @param imageUploadService {{ImageUploadService DI}}
   * @param route {{ActivatedRoute DI}}
   * @param router {{Router DI}}
   * @description {{DI is pushed in this component constractor class}}
   */
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private imageUploadService: ImageuploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  /**
   * @func {{imageUploadJq}}
   * @description {{on change input box the the image upload form is submited}}
   */
  imageUploadJq(){
    // image upload ajax init method
    this.imageUploadService.imageUpload('#myProfileImages');
    
    // after ajaxform plugin init then submit the whole code
    $('#myProfileImages').submit();
  }

  /**
   * @func {{getSingleUserData}}
   * @param \{{{string}}\} {{clientToken}} {{pass the single client user id token}}
   * @description {{this method will make the service call fetch the data as per token}}
   */
  private getSingleUserData(clientToken){
    this.userService.getMyProfile(clientToken)
      .subscribe(
        data => {
          // console.log(data.user);
          this.profileDetails = data.user;
          if(this.profileDetails.thumb_image_url == ''){
            this.noProfileImage = false
          } else{
            this.noProfileImage = true
          }
          // loader removed
          $('.setting-http-load, .linear-progress').fadeOut()
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      )
  }


  /**
   * @func {{updateClientDetails}}
   * @description {{this method will update the client details}}
   */
  updateClientDetails(){
    // console.log(this.profileDetails)
    this.userService.updateMyProfile(this.profileDetails)
      .subscribe(
        data => {
          if (data.status === 'success') {
            // console.log(data)
            this.grawlmsgs = [];
            this.grawlmsgs.push({severity:'success', summary:'Success', detail: 'Client details updated successfully'});
            // back to list page
          }
          if(data.status === 'fail'){
            this.myProfileUpdatedCheckingErrorObj = data.errors;
            this.msgs = [];
            this.msgs.push({severity:'error', summary:'Facebook', detail: this.myProfileUpdatedCheckingErrorObj.facebook_token[0]});
            this.msgs.push({severity:'error', summary:'G-plus', detail: this.myProfileUpdatedCheckingErrorObj.google_token[0]});
            this.msgs.push({severity:'error', summary:'Phone Number', detail: this.myProfileUpdatedCheckingErrorObj.phone_number[0]});
            this.msgs.push({severity:'error', summary:'Twitter', detail: this.myProfileUpdatedCheckingErrorObj.twitter_token[0]});
            this.msgs.push({severity:'error', summary:'Website', detail: this.myProfileUpdatedCheckingErrorObj.website[0]});
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!')
        }
      );
  }

  /**
   * @func {{ngOnInit}}
   * @description {{this is lifecycle function}}
   */
  ngOnInit() {
    // get the data from the query param
    this.route.queryParamMap.subscribe(params => {
      // store the param data in the this local query obj
      this.queryObj = {...params.keys, ...params};

      // set the id
      this.id = this.queryObj.params.token;

      // service call for fetch the data as per token
      this.getSingleUserData(this.id);

      // image update url creating
      this.myProfileImageUpdateApi = `${config.api_base_url}user/save-profile-picture?api_token=${this.id}`
    });

  }

}

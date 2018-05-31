import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../_services/user.service';
import {ImageuploadService} from '../../../_services/imageupload/imageupload.service';
import * as config from '../../../config';

import {Message} from 'primeng/primeng';

// for jquery
declare var $: any;

@Component({
  selector: 'my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})

/**
 * @class \{{{class}}\} {{MyProfileComponent}}
 * @description {{description}}{{ this is my MyProfileComponent class. This is an exported class}}
 */
export class MyProfileComponent implements OnInit {
  /**
   * @property \{{{Message[]}}\} {{msgs}} {{this will hold the all message data}}
   */
  msgs: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{profileDetails}} {{this holds the authenticated user my profile data}}
   */
  profileDetails:any = [];
  /**
   * @property \{{{boolean}}\} {{myProfileUpdatedSuccess}} {{my profile update success statue}}
   */
  myProfileUpdatedSuccess: boolean = false;
  /**
   * @property \{{{boolean}}\} {{myProfileUpdatedError}} {{my profile update error statue}}
   */
  myProfileUpdatedError: boolean = false;

  /**
   * @property \{{{boolean}}\} {{myProfileUpdatedCheckingError}} {{my profile fail error}}
   */
  myProfileUpdatedCheckingError: boolean = false;
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
   * @property \{{{any}}\} {{socialPermition}} {{this will hold the social field validation}}
   */
  socialPermition: any = [];


  // test: any = {
  //   'hello': "false"
  // }
  /**
   * @constructor \{{{constructor}}\}
   */
  constructor(
    private userService: UserService,
    private imageUploadService: ImageuploadService
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
   * @func {{imageUploadChange}}
   * @description {{upload profile image in the my profile section}}
   * @todo need some r&d on this
   */
  // imageUploadChange(event){
  // // imageUploadChange(fileInput: any){
  //   let files = event.srcElement.files;
  //   // console.log(files);
    
  //   let formData = new FormData();
  //   let mainimagefile = files[0];
  //   // console.log(mainimagefile);

  //   // this.myProfileImage.profileImg.profile_picture = formData.append('selectFile', mainimagefile, mainimagefile.name);

  //   this.myProfileImage.profileImg.profile_picture = mainimagefile;

  //   console.log(this.myProfileImage.profileImg);

  //   // this.updateMyProfile()

  //   // if (fileInput.target.files && fileInput.target.files[0]) {
  //   //     var reader = new FileReader();

  //   //     reader.onload = function (e : any) {
  //   //         $('#preview').attr('src', e.target.result);
  //   //         console.log(e.target.result);
  //   //     }

  //   //     reader.readAsDataURL(fileInput.target.files[0]);
  //   // }

  //   this.userService.updateMyProfileImage(this.myProfileImage.profileImg)
  //     .subscribe(
  //       data => {
  //         if (data.status === 'success') {
  //           console.log(data)
  //         }
  //       },
  //       error => {
  //         console.log('error');
  //       });
  // }

  /**
   * @func {{updateMyProfile}}
   * @description {{this is update my profile submit function. Update the details in the server}}
   */
  updateMyProfile():void {
    this.userService.updateMyProfile(this.profileDetails)
      .subscribe(
        data => {
          if (data.status === 'success') {
            // console.log(data)
            // this.myProfileUpdatedSuccess = true;
            // this.myProfileUpdatedCheckingError = false;
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Success', detail: 'My profile updated successfully'});
          }
          if(data.status === 'fail'){
            this.myProfileUpdatedCheckingErrorObj = data.errors;
            // console.log(this.myProfileUpdatedCheckingErrorObj)
            this.msgs = [];
            if(this.myProfileUpdatedCheckingErrorObj.facebook_token){
              this.msgs.push({severity:'error', summary:'Facebook', detail: this.myProfileUpdatedCheckingErrorObj.facebook_token[0]});
            }
            if(this.myProfileUpdatedCheckingErrorObj.google_token){
              this.msgs.push({severity:'error', summary:'G-plus', detail: this.myProfileUpdatedCheckingErrorObj.google_token[0]});
            }
            if(this.myProfileUpdatedCheckingErrorObj.phone_number){
              this.msgs.push({severity:'error', summary:'Phone Number', detail: this.myProfileUpdatedCheckingErrorObj.phone_number[0]});
            }
            if(this.myProfileUpdatedCheckingErrorObj.twitter_token){
              this.msgs.push({severity:'error', summary:'Twitter', detail: this.myProfileUpdatedCheckingErrorObj.twitter_token[0]});
            }
            // if(this.myProfileUpdatedCheckingErrorObj.website){
            //   this.msgs.push({severity:'error', summary:'Website', detail: this.myProfileUpdatedCheckingErrorObj.website[0]});
            // }
          }
        },
        error => {
          // console.log(error);
          let err = error.json() || 'other';
          console.log(err);
          this.myProfileUpdatedError = true;
          this.myProfileUpdatedSuccess = false;
            this.myProfileUpdatedCheckingError = false;
        });
  }

  /**
   * @private 
   * @func {{parseDate}}{{parse the date and return the date object form input type date}}
   * @param dateString
   * @todo need to do time stamp
   */
  // private parseDate(dateString: string): Date {
  //     if (dateString) {
  //         return new Date(dateString);
  //     } else {
  //         return null;
  //     }
  // }

  /**
   * @private 
   * @func {{closeUpdatedSuccessAlert}}
   * @description {{close the update success alert message box}}
   */
  private closeUpdatedSuccessAlert(): void {
    this.myProfileUpdatedSuccess = false;
  }

  /**
   * @private 
   * @func {{closeUpdatedErrorAlert}}
   * @description {{close the update error alert message box}}
   */
  private closeUpdatedErrorAlert(): void {
    this.myProfileUpdatedError = false;
  }

  /**
   * @private 
   * @func {{closeUpdatedSameValueErrorAlert}}
   * @description {{close the update error alert message box when get same value}}
   */
  private closeUpdatedSameValueErrorAlert(): void {
    this.myProfileUpdatedCheckingError = false;
  }


  /**
   * @func {{ngOnInit}}{{This is a life cycle hook}}
   */
  ngOnInit():void {
    // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();

    // get me profile data from service by subscribe amd set the value 'this.profileDetails' property
    this.userService.getMyProfile(this.authUser.api_token)
        // .subscribe(profileData => this.profileDetails = profileData.user)
        .subscribe(function(profileData){
          this.profileDetails = profileData.user;
          this.socialPermition = profileData.organizationparmition[0];
          console.log(profileData.organizationparmition[0]);
          
          if(this.profileDetails.thumb_image_url == ''){
            this.noProfileImage = false
          } else{
            this.noProfileImage = true
          }
          $('.setting-http-load, .linear-progress').fadeOut()
        }.bind(this))
    
    

    // image update url creating
    this.myProfileImageUpdateApi = `${config.api_base_url}user/save-profile-picture?api_token=${this.authUser.api_token}`
    



  }

}

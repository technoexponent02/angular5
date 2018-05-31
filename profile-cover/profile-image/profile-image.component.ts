import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { ActivatedRoute } from '@angular/router';

import { CommonService } from '../../../api/common.service';
import { HeaderService } from '../../../api/header.service';
import { DataService } from './../../../api/data.service';


import { appConfig } from '../../../appConfig';

declare var $: any;

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css'],
})
export class ProfileImageComponent implements OnInit {

  /**
   * @description {{Bootstrap modal configuration}}
   */
  modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'imageModal modalprofile modal-md'
  };

  /**
   * @property \{{{any}}\} {{userDetails}} {{to hold the localStorage details}}
   */
  userDetails: any = {};

  /**
   * @property \{{{any}}\} {{model}} {{this is used to bind the modal form data}}{{}}
   */
  model: any = {};


  /**
   * @property \{{{any}}\} {{data}} {{used for cropper}}
   */
  data: any;
  /**
   * @property \{{{cropperSettings}}\} {{cropperSettings}} {{used for cropper}}{{}}
   */
  cropperSettings: CropperSettings;
  /**
   * @property \{{{any}}\} {{hasimage}} {{used for maintaining a state for profile image}}{{}}
   */
  hasimage: any = true;
  /**
   * @property \{{{any}}\} {{uploadurl}} {{this will set the public upload folder}}
   */
  uploadurl: any = appConfig.uploadurl;
  /**
   * @property \{{{any}}\} {{loading}} {{this will make the button state and loading}}
   */
  loading: any = false;
  /**
   * @property \{{{any}}\} {{otherProfile}} {{this will set the other profile or not}}
   */
  otherProfile: any = 'no';




  /**
   * @constructor
   * @description {{DI will be pushed here}}
   */
  constructor(
    private modalService: BsModalService,
    private commonService: CommonService,
    private headerService: HeaderService,
    private mdata: DataService,
    private route: ActivatedRoute
  ) {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 140;
    this.cropperSettings.height = 140;
    this.cropperSettings.croppedWidth = 140;
    this.cropperSettings.croppedHeight = 140;
    this.cropperSettings.canvasWidth = 570;
    this.cropperSettings.canvasHeight = 300;

    this.data = {};

  }


  /**
   * @function {{changePic}}
   * @description {{this hits the hidden input field for image change}}
   */
  changePic() {
    this.hasimage = false;
    setTimeout(() => {
      $('.profileimage').find('input')[0].click();
    }, 1000);
  }


  /**
   * @function {{dataURLtoFile}}
   * @description {{this is used for converthing the date url to file}}
   * @param dataurl
   * @param filename
   */
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }


  /**
   * @function {{saveProfile}}
   * @description {{this is used for save profile image}}
   */
  saveProfile() {
    if (this.data.image == undefined) {
      this.closemodal();
      return;
    } else {
      // console.log(this.data.image)

      const imgfile = this.dataURLtoFile(this.data.image, 'profile-image.jpg');
      // console.log(imgfile);

      // append image file into from data
      const formData = new FormData();
      formData.append('profile_picture', imgfile);

      // post the profile image to the server
      this.sendFile(formData);
    }
  }


  /**
   * @function {{sendFile}}
   * @description {{this will service call and upload the profile image}}
   * @param file
   */
  sendFile(file) {
    // toggle  button loading state
    this.loading = true;

    this.headerService.upload(file, this.commonService.getAuthUser().api_token)
      .subscribe(
        (data: any) => {
          // setting the data
          localStorage.setItem('meraDetails', JSON.stringify(data.user));
          // on init call again
          this.ngOnInit();
          this.closemodal();

          this.updatedAuth();

          // toggle  button loading state
          this.loading = false;
        },
        error => {
          console.log(error);
          alert('Something went wrong!')
          // toggle  button loading state
          this.loading = false;
        }
      );
  }

  /**
   * @func {{updatedAuth}}
   * @description {{this will send message as updated auth}}
   */
  updatedAuth() {
    this.mdata.updateAuth('update auth');
  }




  /**
   *@function {{loginModal}}
   *@description {{this will open the login form}}
   */
  profilePicModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  /**
   * @function {{closemodal}}
   * @description {{To hide the modal}}
   */
  closemodal() {
    this.modalRef.hide();
    this.hasimage = true;
  }


  /**
   * @function {{deleteProfilePic}}
   * @description {{this will service call and delets the profile image}}
   */
  deleteProfilePic() {
    this.headerService.deleteProfilePic(this.commonService.getAuthUser().api_token)
      .subscribe(
        (data: any) => {
          // set the data
          localStorage.setItem('meraDetails', JSON.stringify(data.user));
          // init call
          this.ngOnInit();
          this.closemodal();


          this.updatedAuth();
        },
        error => {
          console.log(error);
          alert('Something went wrong!')
        }
      );
  }



  /**
   * @func {{getPublicProfile}}
   * @description {{this will fetch the others profile as per public profile}}
   */
  getPublicProfile() {
    this.route.params.subscribe(params => {

      // if has param id
      if ( params['id'] !== undefined){

        this.commonService.getPublicUser(params['id'])
          .subscribe(
            (data: any) => {
              this.userDetails = data.user;

              // remove
              // $('body').removeClass('noprof');
              // $('.noprof').remove();
            },
            err => {
              console.log(err);
              if (err.error.errors) {
                $('body').addClass('noprof');
                // $('.profilesec').before(`<div class="noprof"><h3>${err.error.errors}</h3></div>`);
                // $('.profilesec').before(`<div class="noprof"></div>`);
              }
            }
          );

      }

    });
  }



  /**
   * @function {{ngOnInit}}
   * @description {{Angulae lifecycle hook}}
   */
  ngOnInit() {
    // this.userDetails = this.commonService.getAuthUser();
    // this.model = this.commonService.getDetails(this.userDetails.api_token);

    this.mdata.currentPublicMessage.subscribe(message => {
      // alert(message);
      if (message == 'no') {
        // other profile state change
        this.otherProfile = message;

        // remove
        // $('body').removeClass('noprof');
        // $('.noprof').remove();

        // get the user data
        this.userDetails = this.commonService.getAuthUser();
        // update auth
        this.mdata.currentAuth.subscribe(updatedAuth => {
          if (updatedAuth == 'update auth') {
            this.userDetails = this.commonService.getAuthUser();
          }
        });
      }
      if (message == 'yes') {
        // other profile state change
        this.otherProfile = message;

        // get the public profile
        this.getPublicProfile();
      }
    });


  }

}

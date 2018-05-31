import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import {
  ActivatedRoute,
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

import { CommonService } from '../../api/common.service';
import { HeaderService } from '../../api/header.service';
import { DataService } from './../../api/data.service';
import { SuggestedService } from '../../api/suggested.service';

import { appConfig } from '../../appConfig';

declare var $: any;

@Component({
  selector: 'app-profile-cover',
  templateUrl: './profile-cover.component.html',
  styleUrls: ['./profile-cover.component.css']
})
export class ProfileCoverComponent implements OnInit {

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
   * @property \{{{any}}\} {{model}} {{this is used to bind the model data}}{{}}
   */
  model: any = {
    first_name: '',
    last_name: '',
    location: '',
    about_me: '',
    phone: '',
    date_of_birth: null,
    lat: '',
    lng: '',
  };

  /**
   * @property \{{{any}}\} {{user}} {{this is used to store the user details}}{{}}
   */
  user: any = {
    'id': '',
    'username': '',
    'api_token': '',
    'first_name': '',
    'last_name': '',
    'email': '',
    'date_of_birth': '',
    'gender': '',
    'location': '',
    'latitude': '',
    'longitude': '',
    'cover_picture': 'NA',
    'cover_picture_small': null,
    'profile_picture': 'NA',
    'profile_picture_small': null,
    'about_me': '',
    'phone': '',
    'privacy_scope': 'NA'
  };

  /**
   * @property \{{{any}}\} {{data}} {{used in croper}}
   */
  data: any;
  /**
   * @property \{{{CropperSettings}}\} {{cropperSettings}} {{used in croper settings}}{{}}
   */
  cropperSettings: CropperSettings;

  /**
   * @property \{{{any}}\} {{hasimage}} {{used to state change}}{{}}
   */
  hasimage: any = true;
  /**
   * @property \{{{any}}\} {{uploadurl}} {{this will set the public upload folder}}
   */
  uploadurl: any = appConfig.uploadurlcover;
  /**
   * @property \{{{any}}\} {{loading}} {{this will make the button state and loading}}
   */
  loading: any = false;
  /**
   * @property \{{{any}}\} {{otherProfile}} {{this will set the other profile or not}}
   */
  otherProfile: any = 'no';

  coverLoad: any = false;

  frnd: any = '';

  





  constructor(
    private modalService: BsModalService,
    private commonService: CommonService,
    private headerService: HeaderService,
    private mdata: DataService,
    private suggestedService: SuggestedService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 903;
    this.cropperSettings.height = 304;
    this.cropperSettings.croppedWidth = 903;
    this.cropperSettings.croppedHeight = 304;
    this.cropperSettings.canvasWidth = 570;
    this.cropperSettings.canvasHeight = 300;

    this.data = {};


  }

  /**
   * @function {{changePic}}
   * @description {{this hits the input type file hidden item}}
   */
  changePic() {
    this.hasimage = false;
    setTimeout(() => {
      $('.coverimage').find('input')[0].click();
    }, 1000);
  }


  /**
   *@function {{loginModal}}
   *@description {{this will open the login form}}
   */
  coverPicModal(template: TemplateRef<any>) {
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
   * @function {{dataURLtoFile}}
   * @description {{this will convert the data url of image to file}}
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
   * @function {{saveCover}}
   * @description {{this is used to save the cover image}}
   */
  saveCover() {
    if (this.data.image == undefined) {
      this.closemodal();
      return;
    } else {
      const imgfile = this.dataURLtoFile(this.data.image, 'cover-image.jpg');
      // append image file into from data
      const formData = new FormData();
      formData.append('cover_picture', imgfile);

      // post the profile image to the server
      this.sendFile(formData);
    }
  }


  /**
   * @function {{sendFile}}
   * @description {{this will service call and give the result}}
   * @param file
   */
  sendFile(file) {
    // toggle  button loading state
    this.loading = true;

    this.headerService.uploadCover(file, this.commonService.getAuthUser().api_token)
      .subscribe(
        (data: any) => {
          localStorage.setItem('meraDetails', JSON.stringify(data.user));

          this.ngOnInit();
          this.closemodal();

          // toggle  button loading state
          this.loading = false;
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
          // toggle  button loading state
          this.loading = false;
        }
      );
  }




  /**
   * @function {{deleteCoverPic}}
   * @description {{this will service call and delete the cover picture}}
   */
  deleteCoverPic() {
    this.headerService.deleteCoverPic(this.commonService.getAuthUser().api_token)
      .subscribe(
        (data: any) => {
          localStorage.setItem('meraDetails', JSON.stringify(data.user));

          this.ngOnInit();
          this.closemodal();
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }


  /**
   * @func {{getPublicProfile}}
   * @description {{this will fetch the others profile as per public profile}}
   */
  getPublicProfile() {
    // make cover loading true
    this.coverLoad = true;

    // this.router.events.subscribe((event: RouterEvent) => {
    //   // this.navigationInterceptor(event)
    //   if (event instanceof NavigationEnd) {
    //     // this.mainloader = false;
    //     // console.log(event, this.route.params.value.id)
    //     this.route.params.subscribe(params => {
    //       // setTimeout(() => {
    //           console.log(params['id']);
    //         // }, 1000);
    //     });
    //   }
    // });



    this.route.params.subscribe(params => {

      

      // setTimeout(() => {
      //   console.log(params['id']);
      // }, 1000);

      // if has param id
      if ( params['id'] !== undefined) {
        // console.log(params['id']);

        this.commonService.getPublicUser(params['id'])
        .subscribe(
          (data: any) => {
            this.user = data.user;

            
            // make cover loading false
            this.coverLoad = false;


            // pending and frnd rqust
            const pending = this.user.user_friend_requests.filter(a => a.friend_id == this.commonService.getAuthUser().id);
            const ysfrnd = this.user.user_accepted_friend_requests.filter(a => a.friend_id == this.commonService.getAuthUser().id);

            // chkr
            if (pending.length == 1) {
              this.frnd = 'pending';
            } else if (ysfrnd.length == 1) {
              this.frnd = 'friend';
            } else {
              this.frnd = '';
            }
            // console.log();

            // a.user.user_friend_requests.filter(a => a.user_id == 49)
            // remove
            // $('body').removeClass('noprof');
            // $('.noprof').remove();
          },
          err => {
            console.log(err);
            if (err.error.errors) {
              // $('body').addClass('noprof');
              // $('.profilesec').before(`<div class="noprof"><h3>${err.error.errors}</h3></div>`);

              // make cover loading false
              this.coverLoad = false;
            }
          }
        );
      }

    });
  }


  /**
   * @func {{addfriend}}
   * @description {{this will send the add friend}}
   */
  addfrnd($data) {
    // console.log($data.id);
    // make local obj

    if (this.frnd == '') {
    
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
            // this.getFriendList(this.commonService.getAuthUser().api_token, this.pagival);

            // get the public profile
            this.getPublicProfile();
          },
          err => {
            console.log(err);

            if (err.error.error.message.friend_id) {
              alert(err.error.error.message.friend_id[0])
            } else {
              alert('Friend request sending failure');
            }
          }
        );

    }

  }



  /**
   * @func {{makFollow}}
   * @description {{this will follow the friend}
   */
  makFollow($data) {
    // console.log($data.id);
    // make local obj

    // if (this.frnd == '') {
    
      const localobj = {
        friend_id: $data.id,
      };

      // send the data
      this.suggestedService.mkFollow(this.commonService.getAuthUser().api_token, localobj)
        .subscribe(
          (data: any) => {
            // console.log(data);
            // get the suggested friends call
            // this.getFriendList(this.commonService.getAuthUser().api_token, this.pagival);

            // get the public profile
            this.getPublicProfile();
          },
          err => {
            console.log(err);

            if (err.error.error.message.friend_id) {
              alert(err.error.error.message.friend_id[0]);
            } else {
              alert('Following failure');
            }
          }
        );

    // }

  }



  /**
   * @func {{makUnFollow}}
   * @description {{this will follow the friend}
   */
  makUnFollow($data) {
    // console.log($data.id);
    // make local obj

    // if (this.frnd == '') {
    
      const localobj = {
        friend_id: $data.id,
      };

      // send the data
      this.suggestedService.mkUnFollow(localobj, this.commonService.getAuthUser().api_token)
        .subscribe(
          (data: any) => {
            // console.log(data);
             // get the public profile
             this.getPublicProfile();
          },
          err => {
            console.log(err);

            if (err.error.error.message.friend_id) {
              alert(err.error.error.message.friend_id[0]);
            } else {
              alert('failure');
            }
          }
        );

    // }

  }



  /**
   * @func {{doBlock}}
   * @description {{make the block user}}
   */
  doBlock($data) {
    // alert($data);

    // make local object
    const localObj = {
      friend_id: $data
    };


    // post api
    this.commonService.mlBlock(localObj, this.commonService.getAuthUser().api_token)
      .subscribe(
        (fdata: any) => {
          this.router.navigate([`/profile/${this.commonService.getAuthUser().username}`]);
        },
        err => {
          console.log(err);
          alert('Failure during blocking');
        }
      );
  }





  /**
   * @function {{ngOnInit}}
   * @description {{Angular lifecycle hook}}
   */
  ngOnInit() {

    
    // update auth
    this.mdata.currentPublicMessage.subscribe(message => {
      // alert(message);
      if (message == 'no') {
        // other profile state change
        this.otherProfile = message;

        // remove
        // $('body').removeClass('noprof');
        // $('.noprof').remove();

        // get the user data
        this.user = this.commonService.getAuthUser();
        // update auth
        this.mdata.currentAuth.subscribe(updatedAuth => {
          if (updatedAuth == 'update auth') {
            this.user = this.commonService.getAuthUser();
          }
        });
      }
      if (message == 'yes') {
        // other profile state change
        this.otherProfile = message;

        // console.log(message);

        // get the public profile
        setTimeout(() => {
          this.getPublicProfile();
        }, 1000);
        
      }
    });



  }

}

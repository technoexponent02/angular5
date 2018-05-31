import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivatedRoute, Router } from '@angular/router';


import { CommonService } from '../../../api/common.service';
import { DataService } from './../../../api/data.service';

import {Message} from 'primeng/primeng';

declare var $: any;
declare var moment: any;


@Component({
  selector: 'app-profile-about',
  templateUrl: './profile-about.component.html',
  styleUrls: ['./profile-about.component.css']
})
export class ProfileAboutComponent implements OnInit {

  msgs: Message[] = [];

  /**
   * @description {{Bootstrap modal configuration}}
   */
  modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modalprofile modal-md'
  };

  /**
   * @property \{{{any}}\} {{model}} {{this is used for binding the modal form data}}{{}}
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
   * @property \{{{any}}\} {{aboutModel}} {{this is used for showing the dabind data}}{{}}
   */
  aboutModel: any = {
    first_name: '',
    last_name: '',
    location: '',
    lat: '',
    lng: '',
    about_me: '',
    phone: '',
    date_of_birth: '',
    username: ''
  };

  /**
   * @property \{{{any}}\} {{user}} {{this is used to store the user data}}{{}}
   */
  user: any = {};
  /**
   * @property \{{{any}}\} {{loading}} {{this will make the button state and loading}}
   */
  loading: any = false;

  userSettings3: any = {
    'inputString': ''
  };

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
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }


  /**
   *@function {{loginModal}}
   *@description {{this will open the login form}}
   */
  aboutModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    // open the pop up and clone the data
    this.makePopupDataClone();
  }


  /**
   * @function {{closemodal}}
   * @description {{To hide the modal}}
   */
  closemodal() {
    this.modalRef.hide();
    this.msgs = [];
  }


  /**
   * @func {{updatedAuth}}
   * @description {{this will send message as updated auth}}
   */
  updatedAuth() {
    this.data.updateAuth('update auth');
  }


  /**
     * @function {{autoCompleteCallback1}}
     * @description {{this is used for location auto complete}}
     */
  autoCompleteCallback1(selectedData: any) {
    // console.log(selectedData);
    this.model.location = selectedData;
    console.log(this.model.location);
    if (this.model.location.response !== false) {
      this.model.lat = this.model.location.data.geometry.location.lat;
      this.model.lng = this.model.location.data.geometry.location.lng;
      this.model.location = this.model.location.data.formatted_address;
    }
  }


  /**
   * @function {{aboutSubmit}}
   * @description {{this will service call and add the about details}}
   */
  aboutSubmit(value) {

    // toggle  button loading state
    this.loading = true;


    // console.log(value);
    const aboutObj = {
      first_name: this.model.first_name,
      last_name: this.model.last_name,
      date_of_birth: moment(this.model.date_of_birth).format('YYYY-MM-DD'),
      latitude: this.model.latitude,
      longitude: this.model.longitude,
      about_me: this.model.about_me,
      phone: this.model.phone,
      location: this.model.location,
      username: this.model.username
    };
    // console.log(this.model, aboutObj);


    if (aboutObj.latitude !== '' && aboutObj.longitude !== '') {
      this.commonService.aboutEdit(aboutObj, this.model.api_token)
        .subscribe(
          (data: any) => {
            // console.log(data);
            // this.aboutModel = data.user;
            this.aboutModel.first_name = data.user.first_name;
            this.aboutModel.last_name = data.user.last_name;
            this.aboutModel.lat = data.user.latitude;
            this.aboutModel.lng = data.user.longitude;
            this.aboutModel.location = data.user.location;
            this.aboutModel.about = data.user.about_me;
            this.aboutModel.phone = data.user.phone;
            this.aboutModel.d_o_b = data.user.date_of_birth;
            this.aboutModel.username = data.user.username;
            // console.log(this.aboutModel);
            localStorage.setItem('meraDetails', JSON.stringify(data.user));

            // toggle  button loading state
            this.loading = false;

            this.msgs = [];
            this.msgs.push({severity: 'success', summary: 'Success', detail: 'Updated successfully'});

            this.updatedAuth();
            this.ngOnInit();

            setTimeout(() => {
              this.closemodal();
            }, 2000);
          },
          err => {
            // toggle  button loading state
            this.loading = false;

            this.msgs = [];
            this.msgs.push({severity: 'error', summary: '', detail: 'Please fill the form correctly'});

            console.log(err);
            if (err.status == 400) {
              console.log(err.error.errors);
              // this.shownotiErr('error', 'Profile update failed.');

              if (err.error.errors.phone) {
                this.msgs = [];
                this.msgs.push({severity: 'error', summary: '', detail: err.error.errors.phone[0]});
              }
            }
          }
        );
    } else {
      // toggle  button loading state
      this.loading = false;

      this.msgs = [];
      this.msgs.push({severity: 'error', summary: '', detail: 'Please select the valid address from the suggestion.'});
      // this.shownotiErr('info', 'Please select the valid address from the suggestion.');
    }
  }



  /**
   * @func {{makePopupDataClone}}
   * @description {{this will clone the data when opening the form}}
   */
  makePopupDataClone() {
    this.model = this.commonService.getAuthUser();
    this.model.date_of_birth = moment(this.model.date_of_birth)._d;

    this.userSettings3['inputString'] = this.model.location;
    this.userSettings3 = Object.assign({}, this.userSettings3);

    Object.assign({}, this.model , this.commonService.getAuthUser());
  }


  /**
   * @func {{getPublicProfile}}
   * @description {{this will fetch the others profile as per public profile}}
   */
  getPublicProfile() {
    this.route.params.subscribe(params => {
      this.commonService.getPublicUser(params['id'])
        .subscribe(
          (data: any) => {
            this.aboutModel = data.user;

            // blocked user
            if (this.aboutModel.userblocked_status == 'Y') {
              this.router.navigate([`/profile/${this.commonService.getAuthUser().username}`]);
            }

            // remove
            $('body').removeClass('noprof');
            $('.noprof').remove();
          },
          err => {
            console.log(err);
            if (err.error.errors) {
              $('body').addClass('noprof');
              $('.profilesec').before(`<div class="noprof"><h3>${err.error.errors}</h3></div>`);
            }
          }
        );
    });
  }



  /**
   * @function {{ngOnInit}}
   * @description {{Angular lifecycle hook}}
   */
  ngOnInit() {
    // make the popupdate clone
    
    this.data.currentPublicMessage.subscribe(message => {
      // alert(message);
      if (message == 'no') {
        // other profile state change
        this.otherProfile = message;

        // remove
        $('body').removeClass('noprof');
        $('.noprof').remove();

        // my profile
        this.makePopupDataClone();
        this.aboutModel = this.commonService.getAuthUser();
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

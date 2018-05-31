import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivatedRoute } from '@angular/router';

import { Message } from 'primeng/primeng';

import { CommonService } from '../../../api/common.service';
import { DataService } from './../../../api/data.service';


declare var $: any;



@Component({
  selector: 'app-profile-experience',
  templateUrl: './profile-experience.component.html',
  styleUrls: ['./profile-experience.component.css']
})
export class ProfileExperienceComponent implements OnInit {

  msgs: Message[] = [];

  /**
   * @property \{{{BsModalRef}}\} {{modalRef}} {{this is used for the modal service}}
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
   * @property \{{{any}}\} {{authUser}} {{this will store authuser data}}
   */
  authUser: any = '';
  /**
   * @property \{{{any}}\} {{model}} {{this is used for binding the about add form value}}
   */
  model: any = {};
  /**
   * @property \{{{any}}\} {{modelUpdate}} {{this is used for binding the about update form value}}
   */
  modelUpdate: any = {};
  /**
   * @property \{{{any}}\} {{form_date}} {{to cnacatinate the form date}}
   */
  form_date: any = {};

  /**
   * @property \{{{any}}\} {{to_date}} {{to concatinate the to date}}
   */
  to_date: any = {};
  /**
   * @property \{{{any}}\} {{experienceList}} {{this will hold the all exprience list}}
   */
  experienceList: any = [];
  /**
   * @property \{{{any}}\} {{loading}} {{this will make the button state and loading}}
   */
  loading: any = false;
  /**
   * @property \{{{any}}\} {{userSettings3}} {{this will make geo auto compleate active}}
   */
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
    private route: ActivatedRoute
  ) { }



  /**
   *@function {{experienceModal}}
   *@description {{this will open the login form}}
   */
  experienceModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);

    $('#cbxShowHide').click(function () {
      this.checked ? $('#to').hide() : $('#to').show(); //time for show
    });
  }



  /**
   * @function {{editexperienceModal}}
   * @description {{this will open the edit experience modal}}
   */
  editexperienceModal(template: TemplateRef<any>, exp) {
    this.modalRef = this.modalService.show(template, this.config);

    // assign the clone object
    this.modelUpdate = Object.assign({}, this.modelUpdate , exp);

    this.userSettings3['inputString'] = this.modelUpdate.location;
    this.userSettings3 = Object.assign({}, this.userSettings3);

    $('#cbxShowHide').click(function () {
      this.checked ? $('#to').hide() : $('#to').show(); //time for show
    });
  }


  /**
   * @func {{deleteExp}}
   * @description {{this will delete the exp}}
   */
  deleteExp($data) {
    if (confirm('Want to delete this exprience')) {
      this.commonService.dltExp($data, this.authUser.api_token)
      .subscribe(
        (data: any) => {
          this.ngOnInit();
          this.closemodal();
        },
        err => {
          console.log(err);
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Failed', detail: 'Failed to delete the exprience'});
        }
      );
    }
  }



  /**
   * @function {{closemodal}}
   * @description {{To hide the modal}}
   */
  closemodal() {
    this.modalRef.hide();
    // make this blank
    this.msgs = [];
  }


  /**
   * @function {{autoCompleteCallback1}}
   * @description {{this is used for location auto complete}}
   */
  autoCompleteCallback1(selectedData: any) {
    this.model.location = selectedData;
    // console.log(this.model.location);
    if (this.model.location.response !== false) {
      this.model.latitude = this.model.location.data.geometry.location.lat;
      this.model.longitude = this.model.location.data.geometry.location.lng;
      this.model.location = this.model.location.data.formatted_address;
    } else {
      alert('Please select a location from the suggestion');
    }
  }


  /**
   * @function {{autoCompleteCallback1}}
   * @description {{this is used for location auto complete}}
   */
  autoCompleteCallback2(selectedData: any) {
    this.modelUpdate.location = selectedData;
    // console.log(this.modelUpdate.location);
    if (this.modelUpdate.location.response !== false) {
      this.modelUpdate.latitude = this.modelUpdate.location.data.geometry.location.lat;
      this.modelUpdate.longitude = this.modelUpdate.location.data.geometry.location.lng;
      this.modelUpdate.location = this.modelUpdate.location.data.formatted_address;
    } else {
      alert('Please select a location from the suggestion');
    }
  }


  /**
   * @function {{expeSubmit}}
   * @description {{this will service call and store the result for experience add}}
   */
  expeSubmit() {
    // loading effect
    this.loading = true;

    // make some changes
    if (this.model.is_currently_working == true) {
      this.model.is_currently_working = 1;
    } else {
      this.model.is_currently_working = 0;
    }
    // fetch the data
    if (this.model.latitude !== '' && this.model.longitude !== '') {
      this.commonService.expeAdd(this.model, this.authUser.api_token)
      .subscribe(
        (data: any) => {
          // show message
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Experience added successfully'});
          // close pop
          setTimeout(() => {
            this.ngOnInit();
            this.closemodal();
            // loading effect
            this.loading = false;
          }, 1500);
        },
        error => {
          console.log(error);
          // loading effect
          this.loading = false;
          // message
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'Failed to add exprience'});
        }
      );
    } else {
      // loading effect
      this.loading = false;
      // message
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter some valid location'});
    }
  }



  /**
   * @function {{updateExp}}
   * @description {{this will service call and store the result for updating a single experience}}
   */
  updateExp() {
    // loading effect
    this.loading = true;

    // make some changes
    if (this.modelUpdate.is_currently_working == true) {
      this.modelUpdate.is_currently_working = 1;
    } else {
      this.modelUpdate.is_currently_working = 0;
    }

    // if user blank the location then this will fill up by default
    this.userSettings3['inputString'] = this.modelUpdate.location;
    this.userSettings3 = Object.assign({}, this.userSettings3);

    // make the social obj
    const updateExpObj = {
      designation: this.modelUpdate.designation,
      company_name: this.modelUpdate.company_name,
      location: this.modelUpdate.location,
      latitude: this.modelUpdate.latitude,
      longitude: this.modelUpdate.longitude,
      from_month: this.modelUpdate.from_month,
      from_year: this.modelUpdate.from_year,
      is_currently_working: this.modelUpdate.is_currently_working,
      to_month: this.modelUpdate.to_month,
      to_year: this.modelUpdate.to_year,
    };

    // fetch the data
    if (this.modelUpdate.latitude !== '' && this.modelUpdate.longitude !== '') {
      this.commonService.updateExp(updateExpObj, this.modelUpdate.id, this.authUser.api_token)
      .subscribe(
        (data: any) => {
          // show message
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Experience updated successfully'});
          // close pop
          setTimeout(() => {
            this.ngOnInit();
            this.closemodal();
            // loading effect
            this.loading = false;
          }, 1500);
        },
        error => {
          console.log(error);
          // loading effect
          this.loading = false;
          // message
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Error', detail: 'Failed to update exprience'});
        }
      );
    } else {
      // loading effect
      this.loading = false;
      // message
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: 'Error', detail: 'Please enter some valid location'});
    }
  }


  /**
   * @func {{getAllExp}}
   * @description {{this will get all exp}}
   */
  getAllExp(token) {
    this.commonService.getAllExperience(token)
      .subscribe(
        (expdata: any) => {
          // console.log(expdata);
          this.experienceList = expdata.response.data;
        },
        err => {
          console.log(err);
          alert('Something went wrong!');
        }
      );
  }


  /**
   * @func {{currentlyWorkChange}}
   * @description {{this will make the current exp}}
   */
  currentlyWorkChange($data) {
    if ($data) {
      this.model.to_month = '01';
      this.model.to_year = new Date().getFullYear();
    }
  }


  /**
   * @func {{currentlyWorkChange}}
   * @description {{this will make the current exp}}
   */
  currentlyWorkChangeedit($data) {
    if ($data) {
      this.modelUpdate.to_month = '';
      this.modelUpdate.to_year = '';
    } else {
      this.modelUpdate.to_month = '01';
      this.modelUpdate.to_year = new Date().getFullYear();
    }
    if (this.modelUpdate.to_month == null && this.modelUpdate.to_year == null) {
      this.modelUpdate.to_month = '01';
      this.modelUpdate.to_year = new Date().getFullYear();
    }
  }


  /**
   * @func {{toYearCheck}}
   * @description {{this will check the date}}
   */
  toYearCheck($data, $editadd) {
    if ($data < this.model.from_year && $editadd == 'add') {
      alert('Year must be gratter the from year');
      setTimeout(() => {
        this.model.to_year = new Date().getFullYear();
      }, 200);
    }

    if ($data < this.modelUpdate.from_year && $editadd == 'edit') {
      alert('Year must be gratter the from year');
      setTimeout(() => {
        this.modelUpdate.to_year = new Date().getFullYear();
      }, 200);
    }
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
            // this.aboutModel = data.user;
            // get all edu fetch
            this.getAllExp(data.user.api_token);

            // remove
            // $('body').removeClass('noprof');
            // $('.noprof').remove();
          },
          err => {
            console.log(err);
            if (err.error.errors) {
              // $('body').addClass('noprof');
              // $('.profilesec').before(`<div class="noprof"><h3>${err.error.errors}</h3></div>`);
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
    // permission wise data fetch
    this.data.currentPublicMessage.subscribe(message => {
      // alert(message);
      if (message == 'no') {
        // other profile state change
        this.otherProfile = message;

        // remove
        // $('body').removeClass('noprof');
        // $('.noprof').remove();

        // my exp
        // get auth user
        this.authUser = this.commonService.getAuthUser();

        // get the model
        this.model = {
          designation: '',
          company_name: '',
          location: '',
          latitude: '',
          longitude: '',
          from_month: '01',
          from_year: new Date().getFullYear(),
          is_currently_working: false,
          to_month: '01',
          to_year: new Date().getFullYear(),
        };


        // get all exp
        this.getAllExp(this.authUser.api_token);
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

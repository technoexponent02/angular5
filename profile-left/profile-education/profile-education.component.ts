import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivatedRoute } from '@angular/router';

import { CommonService } from '../../../api/common.service';
import { DataService } from './../../../api/data.service';

import { Message } from 'primeng/primeng';

declare var $: any;

@Component({
  selector: 'app-profile-education',
  templateUrl: './profile-education.component.html',
  styleUrls: ['./profile-education.component.css']
})
export class ProfileEducationComponent implements OnInit {

  msgs: Message[] = [];

  /**
   * @property \{{{any}}\} {{authUser}} {{this will store authuser data}}
   */
  authUser: any = '';

  /**
   * @property \{{{BsModalRef}}\} {{modalRef}} {{this is used for modal service}}
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
   * @property \{{{any}}\} {{model}} {{this is used for binding the education form modal}}
   */
  model: any = {};
  /**
   * @property \{{{any}}\} {{editmodel}} {{this is used for binding the education form modal}}
   */
  editmodel: any = {};
  /**
   * @property \{{{any}}\} {{experienceList}} {{this will hold the all exprience list}}
   */
  eduList: any = [];
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
    private data: DataService,
    private route: ActivatedRoute
  ) { }



  /**
   * @function {{loginModal}}
   * @description {{this will open the login form}}
   */
  educationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
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
   * @function {{editedicationModal}}
   * @description {{this is used for edit education modal}}
   * @param template
   */
  editedicationModal(template: TemplateRef<any>, $edu) {
    this.modalRef = this.modalService.show(template, this.config);

    // assign the clone object
    this.editmodel = Object.assign({}, this.editmodel, $edu);

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
    } else {
      alert('Please select a location from the suggestion');
    }
  }

  /**
   * @function {{eduSubmit}}
   * @description {{this will service call and returns the result for add education modal}}
   */
  eduSubmit() {
    // loading effect
    this.loading = true;
    // data post
    this.commonService.educationAdd(this.model, this.authUser.api_token)
      .subscribe(
        (data: any) => {
          // show message
          this.msgs = [];
          this.msgs.push({severity: 'success', summary: 'Success', detail: 'Education added successfully'});
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
  }






  /**
   * @function {{eduUpdate}}
   * @description {{this will service call and update the educational details}}
   */
  eduUpdate() {
    // loading effect
    this.loading = true;

    // make local object
    const updateEduObj = {
      school_college_name: this.editmodel.school_college_name,
      board_university_name: this.editmodel.board_university_name,
      degree_name: this.editmodel.degree_name
    };

    // api call
    this.commonService.educationUpdate(updateEduObj, this.editmodel.id, this.authUser.api_token)
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
  }


  /**
   * @func {{deleteExp}}
   * @description {{this will delete the exp}}
   */
  deleteEdu($data) {
    if (confirm('Want to delete this education')) {
      this.commonService.dltEdu($data, this.authUser.api_token)
      .subscribe(
        (data: any) => {
          this.ngOnInit();
          this.closemodal();
        },
        err => {
          console.log(err);
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: 'Failed', detail: 'Failed to delete the education'});
        }
      );
    }
  }




  /**
   * @func {{getAllEdu}}
   * @description {{this will get all edu}}
   */
  getAllEdu(token) {
    this.commonService.getAllEducation(token)
      .subscribe(
        (expdata: any) => {
          // console.log(expdata);
          this.eduList = expdata.response.data;
        },
        err => {
          console.log(err);
          alert('Something went wrong!');
        }
      );
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
            this.getAllEdu(data.user.api_token);

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

    // as per permission wise fetch
    this.data.currentPublicMessage.subscribe(message => {
      // alert(message);
      if (message == 'no') {
        // other profile state change
        this.otherProfile = message;

        // remove
        // $('body').removeClass('noprof');
        // $('.noprof').remove();

        // my edu
        // get auth user
        this.authUser = this.commonService.getAuthUser();

        // assign the data model
        this.model = {
          school_college_name: '',
          board_university_name: '',
          degree_name: ''
        };

        // get all education
        this.getAllEdu(this.authUser.api_token);
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

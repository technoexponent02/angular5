import { Component, OnInit, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { AuthServices } from '../../../_services/auth.service';
import { HeaderCoverServices } from '../../../_services/header-cover.service';
import { DataService } from '../../../_services/data.service';
import { CommonService } from '../../../_services/common.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

declare var $: any;
declare var moment: any;

@Component({
  selector: 'm-cover',
  templateUrl: './m-cover.component.html',
  styleUrls: ['./m-cover.component.css'],
})
export class MCoverComponent implements OnInit {
  /**
   * @description {{modal open for editing}}
   */
  modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm profileBannerCover'
  };
  /**
   * @property \{{{any}}\} {{authUser}} {{this will hold the full authuser details}}
   */
  authUser: any = '';
  /**
   * @property \{{{any}}\} {{selectedTemplate}} {{selected template value}}
   */
  selectedTemplate: any = null;
  /**
   * @property \{{{any}}\} {{showEditCoverTpl}} {{selected template status}}
   */
  showEditCoverTpl: any = false;
  /**
   * @property \{{{any}}\} {{templateData}} {{cover template data store here}}
   */
  templateData: any = '';
  /**
   * @property \{{{any}}\} {{profileImage}} {{this will store the profile image}}
   */
  profileImage: any = '';
  /**
   * @property \{{{any}}\} {{headerImageOne}} {{this will store the header image}}
   */
  headerImageOne: any = '';
  /**
   * @property \{{{any}}\} {{headerImageTwo}} {{this will store the header image}}
   */
  headerImageTwo: any = '';
  /**
   * @property \{{{any}}\} {{headerImageThree}} {{this will store the header image}}
   */
  headerImageThree: any = '';
  /**
   * @property \{{{any}}\} {{showHeaderLoading}} {{this will show until header come}}
   */
  showHeaderLoading: any = true;
  /**
   * @property \{{{message}}\} {{message}} {{as per this message the header will update accordingly}}
   */
  message: string;
  /**
   * @property \{{{any}}\} {{urlData}} {{this will store the url params data}}
   */
  urlData: any = '';
  /**
   * @property \{{{any}}\} {{editBtn}} {{this will hide show the user data}}
   */
  editBtn: any = true;

  user: any;



  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private authServices: AuthServices,
    private headerCoverServices: HeaderCoverServices,
    private data: DataService,
    private route: ActivatedRoute,
    private common: CommonService
  ) {}


  /**
   * @func {{receiveDefaultState}}
   * @description {{this will recive the state from child component}}
   */
  receiveDefaultState($event) {
    this.selectedTemplate = $event.coverselected;
    this.showEditCoverTpl = $event.showeditstatus;
  }

  /**
   * @func {{showEditCover}}
   * @description {{as per this status change show the cover selection}}
   */
  showEditCover(){
    this.showEditCoverTpl = true;
  }



  /**
   * @func {{openModal}}
   * @description {{this will open the popup}}
   */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);

    // get the tpl id
    this.selectedTemplate = JSON.parse(localStorage.getItem('YamubaHeaderCover')).tplid;

    setTimeout(() => {
      $(`#tpl-${this.selectedTemplate}`).prop( 'checked', true );
    }, 1000);
  }

  /**
   * @func {{closeModal}}
   * @description {{this will close the modal and change the state}}
   */
  closeModal() {
    this.modalRef.hide();
    // set default state
    setTimeout(() => {
      // this.selectedTemplate = null;
      this.selectedTemplate = JSON.parse(localStorage.getItem('YamubaHeaderCover')).tplid;
      this.showEditCoverTpl = false;
    }, 1500);
  }


  /**
   * @func {{getCoverTemplate}}
   * @description {{this will get the coverimage tempate}}
   */
  getCoverTemplate($user, $cat) {
    // make locak object
    const localobj = {
      template_for: $user,
      template_for_usertype: $cat //for band header this will change
    };
    // console.log(localobj);

    // api call
    this.headerCoverServices.getTemplate(localobj)
      .subscribe(
        (data: any) => {
          console.log(data);
          this.templateData = data;

          // set the data to the localstorage
          localStorage.setItem('YamubaHeaderCover', JSON.stringify(this.templateData));

          // bypass safe data
          this.profileImage = this.sanitizer.bypassSecurityTrustStyle(`url(${this.templateData.profileImage.imagesource.image})`);
          if (this.templateData.headerImage !== undefined) {
            this.headerImageOne = this.sanitizer.bypassSecurityTrustStyle(`url(${this.templateData.headerImage.imagesource.image})`);
          }
          if (this.templateData.headerImageOne !== undefined) {
            this.headerImageOne = this.sanitizer.bypassSecurityTrustStyle(`url(${this.templateData.headerImageOne.imagesource.image})`);
          }
          if (this.templateData.headerImageTwo !== undefined) {
            this.headerImageTwo = this.sanitizer.bypassSecurityTrustStyle(`url(${this.templateData.headerImageTwo.imagesource.image})`);
          }
          if (this.templateData.headerImageThree !== undefined) {
            this.headerImageThree = this.sanitizer.bypassSecurityTrustStyle(`url(${this.templateData.headerImageThree.imagesource.image})`);
          }

          // show the header banner
          this.showHeaderLoading = false;

          // template number assign as per user header cover
          this.selectedTemplate = JSON.parse(localStorage.getItem('YamubaHeaderCover')).tplid;
        },
        error => {
          console.log(error);
          alert('something went wrong in the header cover area!');
        }
      );
  }



  /**
   * @func {{ngOnInit}}
   * @description {{Lifecycle hook}}
   */
  ngOnInit() {
    // get authuser data
    this.authUser = this.authServices.getAuthUser();


    // get user name
    this.data.newUser.subscribe(
      user => {
        this.user = user;
        // fetch call
        this.getCoverTemplate(this.user, 1);

        // editbtn off
        if (this.user !== this.authUser.username){
          this.editBtn = false;
        }
      }
    );

    // fetch call
    // this.getCoverTemplate(this.authUser);


    /**
     * @description {{This will make the subscribe call and change the header area}}
     */
    this.data.currentMessage.subscribe(
      message => {
        // this.message = message;
        if (message == 'refresh-header') {
          // fetch call
          this.getCoverTemplate(this.user, 1)
        }
      }
    );


    // profile view count
    this.common.viewCount(this.user, 'm', this.common.getBrowser().ip)
      .subscribe(
        (data: any) => {
          if (data.status == 0) {
            alert(data.message);
          }
        },
        error => {
          console.log(error);
        }
      );

  }

}

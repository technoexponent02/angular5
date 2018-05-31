import { Component, OnInit, Input, Output, EventEmitter   } from '@angular/core';
import { AuthServices } from '../../../../_services/auth.service';
import { HeaderCoverServices } from '../../../../_services/header-cover.service';



declare var $: any;
declare var moment: any;


@Component({
  selector: 'mcover-template-2',
  templateUrl: './template-2.component.html',
  styleUrls: ['./template-2.component.css']
})
export class Template2Component implements OnInit {
  /**
   * @property \{{{any}}\} {{authUser}} {{this will set the auth user data}}
   */
  authUser: any;
  /**
   * @property \{{{@Input}}\} {{name}} {{get the template id from the parent component}}
   */
  @Input() templateId: any;
  /**
   * @property \{{{any}}\} {{defaultState}} {{make the default state}}
   */
  defaultState: any = {
    'coverselected': null,
    'showeditstatus': false
  };
  /**
   * @property \{{{@Output}}\} {{defaultStateEvent}} {{send the default state to the parent component}}
   */
  @Output() defaultStateEvent = new EventEmitter<string>();
  /**
   * @property \{{{any}}\} {{templateModel}} {{this is save popup form data model}}
   */
  templateModel: any = {
    api_token: '',
    template_for: '',
    template_for_usertype: 1,
    tplid: '',
    profileImage: {
      imagesource: {
        image: ''
      }
    },
    headerImage: {},
    headerColor: '#343436'
  };
  /**
   * @property \{{{any}}\} {{uploadImage}} {{set the which image is uploading}}
   */
  uploadImage: any = {
    status: '',
  };
  /**
   * @property \{{{any}}\} {{uploadComponentShow}} {{uploading component state}}
   */
  uploadComponentShow: any = false;
  /**
   * @property \{{{any}}\} {{btnDisable}} {{btn disable}}
   */
  btnDisable: any = false;


  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private authServices: AuthServices,
    private headerCoverServices: HeaderCoverServices
  ) { }
  

  /**
   * @func {{sendDefaultState}}
   * @description {{this methot will send the state value to the parent}}
   */
  sendDefaultState() {
    this.defaultStateEvent.emit(this.defaultState);
  }

  /**
   * @func {{profileUpload}}
   * @description {{change the upload image status and file upload component status for the profile image}}
   */
  profileUpload() {
    this.uploadImage.status = 'profile-image';
    this.uploadImage.width = 200;
    this.uploadImage.height = 200;
    this.uploadComponentShow = true;
  }

  /**
   * @func {{headerImageUpload}}
   * @description {{change the upload image status and file upload component status for the header image}}
   */
  headerImageUpload() {
    this.uploadImage.status = 'header-image-tpl';
    this.uploadImage.width = 1350;
    this.uploadImage.height = 335;
    this.uploadComponentShow = true;
  }



  /**
   * @func {{receiveDefaultState}}
   * @description {{this will recive the state from child component}}
   */
  receiveUploadedDataAndState($event) {
    this.uploadComponentShow = $event.showComponentStatus;
    // this.templateModel.fullData = $event.uploaded;
    // alert($event.whichImage);

    /**
     * @todo
     */
    // console.log($event);

    /**
     * @description {{this will set the upload profile image data }}
     */
    if ($event.imagesource.image !== undefined && $event.whichImage == 'profile-image'){
      this.templateModel.profileImage = $event;
    }
    /**
     * @description {{this will set the upload profile image data }}
     */
    if ($event.imagesource.image !== undefined && $event.whichImage == 'header-image-tpl'){
      this.templateModel.headerImage = $event;
    }


    // remove class select pic
    $(document).find('.profileBannerCover').removeClass('selectPicturePop');
  }


  /**
   * @todo 
   */
  saveTpl() {
    // console.log(this.templateModel);

    this.btnDisable = true;

    // api hit
    this.headerCoverServices.saveHeader(this.templateModel)
      .subscribe(
        (data: any) => {
          // console.log(data);
          if (data.status == 1) {
            window.location.reload();
          }
          if (data.status == 0) {
            alert(data.message);
            this.btnDisable = false;
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
          this.btnDisable = false;
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


    // as per profile image set the value in the profile area
    // and also set the value to the data
    this.templateModel.profileImage.imagesource.image = JSON.parse(localStorage.getItem('YamubaHeaderCover')).profileImage.imagesource.image;


    // set token and userid
    this.templateModel.api_token = this.authUser.token;
    this.templateModel.template_for = this.authUser.uid;

    // set the tpl id
    this.templateModel.tplid = this.templateId;


  }

}

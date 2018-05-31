import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../../_services/user.service';
import { LanguageService } from '../../../_services/language/language.service'
import {ImageuploadService} from '../../../_services/imageupload/imageupload.service';
import * as config from '../../../config';

import {Message} from 'primeng/primeng';

// for jquery
declare var $: any;

@Component({
  selector: 'app-client-branding',
  templateUrl: './client-branding.component.html',
  styleUrls: ['./client-branding.component.css']
})
export class ClientBrandingComponent implements OnInit {
   /**
   * @property \{{{any}}\} {{id}} {{this is where we store diffrent user token}}
   */
  token:any;
  /**
   * @property \{{{type}}\} {{orgId}} {{this will store the orgid}}
   */
  orgId: any;
  /**
   * @property \{{{any}}\} {{queryObj}} {{this will get the query data from the url}}
   */
  queryObj:any;
  /**
   * @property \{{{Message[]}}\} {{btmmsgs}} {{store the bottom form message data}}
   */
  btmmsgs: Message[] = [];
  /**
   * @property \{{{Message[]}}\} {{msg}} {{store the message data}}
   */
  msgs: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{userLanguage}} {{this holds the user language selected value}}
   */
  userLanguage: any = {}; 
  /**
   * @property \{{{any}}\} {{brandingDetails}} {{this holds the authenticated user branding all data}}
   */
  brandingDetails:any = [];
 
  /**
   * @property \{{{boolean}}\} {{brandingUpdatedSuccess}} {{branding update success status}}
   */
  brandingUpdatedSuccess: boolean = false;
 /**
   * @property \{{{boolean}}\} {{brandingUpdatedError}} {{as per form post error server side 
   *                                                          this boolean value will be changed}}
   */
  brandingUpdatedError: boolean = false;
  /**
   * @property \{{{any}}\} {{logoImageUpdateApi}} {{this will be a api url for the image upload}}
   */
  logoImageUpdateApi: any = '';
  /**
   * @property \{{{any}}\} {{hasNadirLogoImg}} {{this will check if has nadir logo or not}}
   */
  hasNadirLogoImg: any = false;
  /**
   * @property \{{{any}}\} {{hasLogoImg}} {{this will check if has logo or not}}
   */
  hasLogoImg: any = false;

  /**
   * @constructor
   * @description {{DI is pushed in this component constractor class}}
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private languageservice: LanguageService,
    private imageUploadService: ImageuploadService
  ) {}

   /**
   * @func {{updateMyProfile}}
   * @description {{this is update my profile submit function. Update the details in the server}}
   */
  updateMyBranding():void {
    this.brandingDetails.api_token=this.authUser.api_token;
    this.brandingDetails.brand_id=this.brandingDetails.id;
    // console.log(this.brandingDetails);

    let brandingPostData = {
      "id": this.brandingDetails.id,
      "user_id": this.brandingDetails.user_id,
      "custom_subdomain": this.brandingDetails.custom_subdomain,
      "from_email": this.brandingDetails.from_email,
      "api_token": this.brandingDetails.api_token,
      "brand_id": this.brandingDetails.brand_id
    }

    this.userService.updateMyBranding(brandingPostData)
      .subscribe(
        data => {
          if (data.status === 'success') {
           //  console.log(data)
            //  this.brandingUpdatedSuccess = true;
            //  this.brandingUpdatedError = false;
            // this.isFormUpdatePostFail=false;
            this.btmmsgs = [];
            this.btmmsgs.push({severity:'success', summary:'Success Message !', detail:'You successfully done the branding update.'});
          }
          if(data.status === 'fail'){
           //  console.log(data)
            this.brandingUpdatedSuccess = false;
            this.brandingUpdatedError=false;
          
          }
        },
        error => {
          // console.log(error);
          let err = error.json() || 'other';
          console.log(err);
           this.brandingUpdatedError = true;
           this.brandingUpdatedSuccess = false;
          // this.configurationUpdatedError = false;
        });
  }

  /**
   * @func {{imageUploadNadirJq}}
   * @description {{this function will call when nadir image upload}}
   */
  imageUploadNadirJq(){
    // image upload ajax init method
    this.imageUploadService.imageUpload('#nadirLogoForm');
    // after ajaxform plugin init then submit the whole code
    $('#nadirLogoForm').submit();
  }

  /**
   * @func {{imageLogoUploadJq}}
   * @description {{this function will call when branding logo image upload}}
   */
  imageLogoUploadJq(){
    // image upload ajax init method
    this.imageUploadService.imageUpload('#brandingLogoForm');
    // after ajaxform plugin init then submit the whole code
    $('#brandingLogoForm').submit();
  }

  /**
   * @private 
   * @method {{cofigurationUpdatedSuccessClose}}
   * @description {{form updated successfully message alert show}}
   */
  private brandingUpdatedSuccessClose():void {
    this.brandingUpdatedSuccess = false;
  }

   /**
   * @private 
   * @method {{formUpdateErrorPostFailClose}}
   * @description {{form updated fail post server related message alert show}}
   */
  private formUpdateErrorPostFailClose():void {
    this.brandingUpdatedError = false;
  }


  /**
   * @func {{ngOnInit}}
   * @description {{this is lifecycle function}}
   */
  ngOnInit() {
    // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();
    this.userLanguage = JSON.parse(localStorage.getItem('lang'))

    // get the data from the query param
    this.route.queryParamMap.subscribe(params => {
      // store the param data in the this local query obj
      this.queryObj = {...params.keys, ...params};
      // console.log(this.queryObj.params, this.lang.locale)

      // set the token
      this.token = this.queryObj.params.token;
      // set the org id
      this.orgId = this.queryObj.params.org_id;

      // console.log(this.token, this.orgId)

      // get me profile data from service by subscribe amd set the value 'this.profileDetails' property
      this.userService.getMyBranding(this.token , this.userLanguage.locale, this.orgId)
      //  .subscribe(brandingData => this.brandingDetails = brandingData.branding)
        .subscribe(
          data => {
            // console.log(data)
            // console.log(data.branding == null)
            $('.setting-http-load, .linear-progress').fadeOut();
            if(data.branding == null){
              console.log('Nothing to do with local object');
              this.msgs.push({severity:'warn', summary:'Warn Message !', detail:'Please setup your organaization first.'});
            }
            else{
              this.msgs = [];
              // has nadir logo or not
              if(data.branding.nadir != null){
                this.hasNadirLogoImg = true
              }
              // has normal logo or not
              if(data.branding.logo != null){
                this.hasLogoImg = true
              }
              this.brandingDetails = data.branding;
            }
          },
          error => {
            console.log(error);
            alert('Something went wrong!');
          }
        )
          
        // image update url creating
        this.logoImageUpdateApi = `${config.api_base_url}user/save-picture?api_token=${this.token}`


    });


  }

}

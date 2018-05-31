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
  selector: 'app-client-organization',
  templateUrl: './client-organization.component.html',
  styleUrls: ['./client-organization.component.css']
})
export class ClientOrganizationComponent implements OnInit {
  /**
   * @property \{{{Message[]}}\} {{msgs}} {{this will hold the all message data}}
   */
  msgs: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{lang}} {{here store the lang value}}
   */
  lang:any
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
   * @property \{{{any}}\} {{organizationDetails}} {{this holds the authenticated user organization data}}
   */
  organizationDetails:any = [];
  /**
   * @property \{{{any}}\} {{logoImageUpdateApi}} {{this will be a api url for the image upload}}
   */
  logoImageUpdateApi: any = '';
  /**
   * @property \{{{any}}\} {{organizationObj}} {{this is hold the updated organaization value 
   *                                             or if server response value is blank array then set the property value
   *                                             by anguler 2 way data binding}}
   */
  organizationObj:any = {};
  /**
   * @property \{{{boolean}}\} {{dontShowProfileImage}} {{as per condition logo image show and hide}}
   */
  dontShowProfileImage: boolean = false;
  /**
   * @property \{{{any}}\} {{orgValidationField}} {{this will store the org validation values}}
   */
  orgValidationField: any = [];
  /**
   * @property \{{{boolean}}\} {{imgNoExt}} {{is image has proper extension}}
   */
  imgNoExt:boolean = false;
  /**
   * @property \{{{any}}\} {{organizationObjForPost}} {{this new object will recreated 
   *                                                    form update or add post method}}
   */
  organizationObjForPost:any = {};
  
    /**
     * @property \{{{boolean}}\} {{isFormUpdatePostFail}} {{as per this boolean value form update fail 
     *                                                      notification alert will be pop out}}
     */
    isFormUpdatePostFail:boolean = false;
  
    /**
     * @property \{{{any}}\} {{organizationFormUpdatePostErrorObj}} {{when post fail the error then 
     *                                                                the error object will store here}}
     */
    organizationFormUpdatePostErrorObj:any = [];
    
    /**
     * @property \{{{boolean}}\} {{organizationUpdatedSuccess}} {{as per form post sucess this boolean 
     *                                                            value will change accordingly }}
     */
    organizationUpdatedSuccess: boolean = false;
    
    /**
     * @property \{{{boolean}}\} {{organizationUpdatedError}} {{as per form post error server side 
     *                                                          this boolean value will be changed}}
     */
    organizationUpdatedError: boolean = false;


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
   * @func {{updateMyOrganization}}
   * @description {{update my organization when form submit}}
   */
  updateMyOrganization():void {
    
        // console.log(this.organizationObjForPost);
    
        // setting up the value for the post object that will send to the server
        this.organizationObjForPost = this.organizationObj;
        this.organizationObjForPost.org_id = this.organizationObj.id;
        this.organizationObjForPost.api_token = this.authUser.api_token;
        this.organizationObjForPost.locale = this.lang.locale;
    
        let orgUpdatedData = {
          "id": this.organizationObjForPost.id,
          "user_id": this.organizationObjForPost.user_id,
          "website": this.organizationObjForPost.website,
          "phone_number_code": this.organizationObjForPost.phone_number_code,
          "phone_number": this.organizationObjForPost.phone_number,
          "tax_id": this.organizationObjForPost.tax_id,
          "postal_code": this.organizationObjForPost.postal_code,
          "country_id": this.organizationObjForPost.country_id,
          "industry_id": this.organizationObjForPost.industry_id,
          "status": this.organizationObjForPost.status,
          "company_name": this.organizationObjForPost.company_name,
          "address": this.organizationObjForPost.address,
          "about": this.organizationObjForPost.about,
          "city": this.organizationObjForPost.city,
          "state": this.organizationObjForPost.state,
          "org_id": this.organizationObjForPost.org_id,
          "api_token": this.organizationObjForPost.api_token,
          "locale": this.organizationObjForPost.locale
        }
        // console.log(orgUpdatedData);
    
        // update the organization and subscribe for the post
        this.userService.updateOrganization(orgUpdatedData)
          .subscribe(
            data => {
              if (data.status === 'success') {
                // playing with some popup hide and show here
                // this.isFormUpdatePostFail = false;
                // this.organizationUpdatedSuccess = true;
                // this.organizationUpdatedError = false;
                this.msgs = [];
                this.msgs.push({severity:'success', summary:'Success', detail: 'You successfully done!'});
              }
              if(data.status === 'fail') {
                // playing with some popup hide and show here
                this.organizationUpdatedSuccess = false;
                this.isFormUpdatePostFail = true;
                this.organizationUpdatedError = false;
                this.organizationFormUpdatePostErrorObj = data;
              }
            },
            error => {
              let err = error.json() || 'other';
              console.log(err);
              this.organizationUpdatedError = true;
            }
          )
    
      }
    
       /**
       * @func {{imageUploadJq}}
       * @description {{on change input box the the image upload form is submited}}
       */
      imageUploadJq(){
        // image upload ajax init method
        this.imageUploadService.imageUpload('#orgLogoForm');
        // after ajaxform plugin init then submit the whole code
        $('#orgLogoForm').submit();
      }
    
      /**
       * @private 
       * @method {{organizationUpdatedSuccessClose}}
       * @description {{form updated successfully message alert show}}
       */
      private organizationUpdatedSuccessClose():void {
        this.organizationUpdatedSuccess = false;
      }
    
      /**
       * @private 
       * @method {{formUpdatePostFailClose}}
       * @description {{form updated fail post message alert show}}
       */
      private formUpdatePostFailClose():void {
        this.isFormUpdatePostFail = false;
      }
    
      /**
       * @private 
       * @method {{formUpdateErrorPostFailClose}}
       * @description {{form updated fail post server related message alert show}}
       */
      private formUpdateErrorPostFailClose():void {
        this.organizationUpdatedError = false;
      }


  /**
   * @private 
   * @method {{urlImgHasExt}}
   * @description {{this method will check the url has proper img extension or not and return true or false}}
   */
  private urlImgHasExt(url){
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  /**
   * @func {{ngOnInit}}
   * @description {{this is lifecycle function}}
   */
  ngOnInit() {
    // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();
    // get the lang value form the local storage
    this.lang = JSON.parse(localStorage.getItem('lang'));

    // get the data from the query param
    this.route.queryParamMap.subscribe(params => {
      // store the param data in the this local query obj
      this.queryObj = {...params.keys, ...params};
      // console.log(this.queryObj.params, this.lang.locale)

      // set the token
      this.token = this.queryObj.params.token;
      // set the org id
      this.orgId = this.queryObj.params.org_id;

      // service call for fetch the data as per token and org id
      this.userService.getOrganization(this.token, this.lang.locale, this.orgId)
      .subscribe(
        data => {
          $('.setting-http-load, .linear-progress').fadeOut();
          // full data assign to the "organizationDetails"
          this.organizationDetails = data;
          
          let orgObj = data.organization;
          let orgValidationObj = data.organizationparmition[0];
          
          // checking if lenght is 0 or not
          if(orgObj.length == 0 ){
            // set the initial time country id and industry id
            this.organizationObj.country_id = 1;
            this.organizationObj.industry_id = 1;
            this.dontShowProfileImage = true;
            // $('.setting-http-load').fadeOut();
            console.log('nothing to do with local object')
          } else {
            this.organizationObj = orgObj;
            this.orgValidationField = orgValidationObj;
            // $('.setting-http-load').fadeOut();
            // set imgNoExt boolean value to checking url for image extension 
            this.imgNoExt = this.urlImgHasExt(this.organizationObj.logo);
          }

        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      )

      // image update url creating
      this.logoImageUpdateApi = `${config.api_base_url}user/save-picture?api_token=${this.token}`;
    });
  }

}

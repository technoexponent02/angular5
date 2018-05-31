import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../_services/user.service';
import {AdminService} from '../../../_services/admin.service';
import {ImageuploadService} from '../../../_services/imageupload/imageupload.service';
import * as config from '../../../config';

import {Message} from 'primeng/primeng';

// for jquery
declare var $: any;

@Component({
  selector: 'app-client-admin-organization',
  templateUrl: './client-admin-organization.component.html',
  styleUrls: ['./client-admin-organization.component.css']
})
export class ClientAdminOrganizationComponent implements OnInit {

  /**
   * @property \{{{Message[]}}\} {{msgs}} {{This is used from "primeng" plugin message notification}}
   */
  msgs: Message[] = [];
  /**
   * @property \{{{Message[]}}\} {{allMessage}} {{This is used from "primeng" plugin growl notification}}
   */
  allMessage: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{store the auth user data from the localstorage}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{lang}} {{store the lang data from the localstorage}}
   */
  lang: any;
  /**
   * @property \{{{any}}\} {{adminOrganaizationDetails}} {{this holds the authenticated admin organaization profile data}}
   */
  adminOrganaizationDetails:any = []
  /**
   * @property \{{{any}}\} {{countryList}} {{hold the all country list data}}
   */
  countryList:any = []
  /**
   * @property \{{{any}}\} {{logoImageUpdateApi}} {{this will be a api url for the image upload}}
   */
  logoImageUpdateApi: any = '';
  /**
   * @property \{{{boolean}}\} {{imgNoExt}} {{is image has proper extension}}
   */
  imgNoExt:boolean = false;



  /**
   * @constructor
   * @param userService {{UserService DI}}
   * @param adminService {{AdminService DI}}
   * @description {{DI is pushed in this component constractor class}}
   */
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private imageUploadService: ImageuploadService
  ) {}

  
  /**
   * @func {{getTheOrgSetting}}
   * @param \{{{number}}\} {{$token}} {{this param will take the user token}}
   * @description {{this method will subscribe the service and get the organaization settings}}
   */
  private getTheOrgSetting($token){
    this.adminService.adminOrgDataEdit($token)
      .subscribe(
        data => {
          // loader remove
          $('.setting-http-load, .linear-progress').fadeOut();
          // console.log(data);
          if(data.status === "success"){
            this.adminOrganaizationDetails = data.organization;
            this.countryList = data.country;
            // set imgNoExt boolean value to checking url for image extension 
            this.imgNoExt = this.urlImgHasExt(this.adminOrganaizationDetails.site_logo);
          }
          if(data.status === "fail"){
            alert('You are not an admin!');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
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
   * @func {{adminOrgEditProcess}}
   * @description {{this method will update the admin organaization save}}
   */
  adminOrgEditProcess(){
    // console.log(this.adminOrganaizationDetails);
    // get filtered data
    let editedData = {
      api_token: this.authUser.api_token,
      company_name: this.adminOrganaizationDetails.admin_name,
      website: this.adminOrganaizationDetails.website,
      phone_number_code: this.adminOrganaizationDetails.phone_number_code,
      phone_number: this.adminOrganaizationDetails.phone_number,
      tax_id: this.adminOrganaizationDetails.tax_id,
      address: this.adminOrganaizationDetails.address,
      postal_code: this.adminOrganaizationDetails.postal_code,
      city: this.adminOrganaizationDetails.city,
      state: this.adminOrganaizationDetails.state,
      country_id: this.adminOrganaizationDetails.country_id,
      support_email: this.adminOrganaizationDetails.support_email,
      billing_email: this.adminOrganaizationDetails.billing_email,
      sales_email: this.adminOrganaizationDetails.sales_email,
      id: this.adminOrganaizationDetails.id,
    }
    // console.log(editedData);
    // subscribe call
    this.adminService.adminOrgDataEditProcess(editedData)
      .subscribe(
        data => {
          if(data.status === "Success"){
            // data.message
            this.allMessage = [];
            this.allMessage.push({severity:'success', summary:'Success Message', detail: data.message});
            // function call for getTheOrgSetting()
            this.getTheOrgSetting(this.authUser.api_token);
          }
          if(data.status === "fail"){
            let errobj = data.errors;
            console.log(errobj);
            this.allMessage = [];
            if(errobj.company_name){
              this.allMessage.push({severity:'error', summary:'Company', detail: errobj.company_name[0]});
            }
            if(errobj.website){
              this.allMessage.push({severity:'error', summary:'Website', detail: errobj.website[0]});
            }
            if(errobj.phone_number_code){
              this.allMessage.push({severity:'error', summary:'Phone code', detail: errobj.phone_number_code[0]});
            }
            if(errobj.phone_number){
              this.allMessage.push({severity:'error', summary:'Phone', detail: errobj.phone_number[0]});
            }
            if(errobj.tax_id){
              this.allMessage.push({severity:'error', summary:'Tax', detail: errobj.tax_id[0]});
            }
            if(errobj.tax_id){
              this.allMessage.push({severity:'error', summary:'Tax', detail: errobj.tax_id[0]});
            }
            if(errobj.address){
              this.allMessage.push({severity:'error', summary:'Address', detail: errobj.address[0]});
            }
            if(errobj.postal_code){
              this.allMessage.push({severity:'error', summary:'Postal code', detail: errobj.postal_code[0]});
            }
            if(errobj.city){
              this.allMessage.push({severity:'error', summary:'City', detail: errobj.city[0]});
            }
            if(errobj.state){
              this.allMessage.push({severity:'error', summary:'State', detail: errobj.state[0]});
            }
            if(errobj.billing_email){
              this.allMessage.push({severity:'error', summary:'Billing email', detail: errobj.billing_email[0]});
            }
            if(errobj.sales_email){
              this.allMessage.push({severity:'error', summary:'Sales email', detail: errobj.sales_email[0]});
            }
            if(errobj.support_email){
              this.allMessage.push({severity:'error', summary:'Support email', detail: errobj.support_email[0]});
            }
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!')
        }
      );
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
   * @description {{This is on init lifecycle hook}}
   */
  ngOnInit() {
    // set the auth user and store the data in the localstorage
    this.authUser = this.userService.getAuthUser();
    // set the lang property value from localstorage
    this.lang = JSON.parse(localStorage.getItem('lang'));
    // function call for getTheOrgSetting()
    this.getTheOrgSetting(this.authUser.api_token);

    // image update url creating
    this.logoImageUpdateApi = `${config.api_base_url}user/save-picture?api_token=${this.authUser.api_token}`
    
  }
}

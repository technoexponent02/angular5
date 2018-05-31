import { Component, OnInit } from '@angular/core';
import {UserService} from '../../_services/user.service';
import {AdminService} from '../../_services/admin.service';

// for jquery
declare var $: any;
// for jquery
declare var jQuery: any;
// for moment
declare var moment: any;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{authUser}} {{store the auth user data form the localstorage}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{clientData}} {{this will hold the all clients value as an object}}
   */
  clientData: any = [];
  /**
   * @property \{{{any}}\} {{countryList}} {{this will store all country object details for the country selectbox}}
   */
  countryList: any = [];
  /**
   * @property \{{{any}}\} {{planList}} {{this will store the user subscription plan lists for plan selectbox}}
   */
  planList: any = [];

  /**
   * @property \{{{string}}\} {{serachOrg}} {{as per inputbox typing for search organaization}}
   */
  serachOrg: string = "";
  /**
   * @property \{{{number}}\} {{selectPlan}} {{initial seclect plan value}}
   */
  selectPlan: any = 0;
  /**
   * @property \{{{number}}\} {{selectStatus}} {{initial seclect status value}}
   */
  selectStatus: any = 0;
  /**
   * @property \{{{number}}\} {{selectCountry}} {{initial seclect country value}}
   */
  selectCountry: any = 0;
  /**
   * @property \{{{any}}\} {{locale}} {{here will set the selected language value.
   *                                    this data will find "ngOnInit" lifecycle hook from localstorage}}
   */
  locale: any = "";
  /**
   * @property \{{{boolean}}\} {{viewClient}} {{this will show hide the organaization display show hide form}}
   */
  viewClient: boolean = true;
  

  expirationDateStart: any;
  expirationDateTo: any;
  signedDateStart: any;
  signedDateTo: any;

  modifiedSignedDateTo: any;

  // store calender data search
  calfrmDate: any = '';
  caltoDate: any = '';
  signcalfrmDate: any = '';
  signcaltoDate: any = '';


  /**
   * @constructor
   * @param userService {{UserService DI}}
   * @param adminService {{AdminService DI}}
   * @description {{DI is pushed in this component constractor class}}
   */
  constructor(
    private userService: UserService,
    private adminService: AdminService
  ) {}

  /**
   * @func {{searchOrg}}
   * @description {{this function will fire on serach organaization "keyup" event}}
   */
  searchOrg(){
    // filter http calling function called
    this.filterClientDataServiceCall(
      this.authUser.api_token,
      this.serachOrg,
      this.locale,
      this.selectPlan,
      this.selectStatus,
      this.selectCountry,
      this.calfrmDate,
      this.caltoDate,
      this.signcalfrmDate,
      this.signcaltoDate
    )
  }

  /**
   * @func {{searchPlan}}
   * @description {{this function will fire on plan selectbox "change" event}}
   */
  searchPlan(){
    // filter http calling function called
    this.filterClientDataServiceCall(
      this.authUser.api_token,
      this.serachOrg,
      this.locale,
      this.selectPlan,
      this.selectStatus,
      this.selectCountry,
      this.calfrmDate,
      this.caltoDate,
      this.signcalfrmDate,
      this.signcaltoDate
    )
  }

  /**
   * @func {{searchStatus}}
   * @description {{this function will fire on status selectbox "change" event}}
   */
  searchStatus(){
    // filter http calling function called
    this.filterClientDataServiceCall(
      this.authUser.api_token,
      this.serachOrg,
      this.locale,
      this.selectPlan,
      this.selectStatus,
      this.selectCountry,
      this.calfrmDate,
      this.caltoDate,
      this.signcalfrmDate,
      this.signcaltoDate
    )
  }

  /**
   * @func {{searchCountry}}
   * @description {{this function will fire on country selectbox "change" event}}
   */
  searchCountry(){
    // filter http calling function called
    this.filterClientDataServiceCall(
      this.authUser.api_token,
      this.serachOrg,
      this.locale,
      this.selectPlan,
      this.selectStatus,
      this.selectCountry,
      this.calfrmDate,
      this.caltoDate,
      this.signcalfrmDate,
      this.signcaltoDate
    )
  }

  // signed date to
  /**
   * @todo FINISH THIS LOGIC WITH THE PROPER DATE
   */
  searchSignedDateTo($event){
    this.modifiedSignedDateTo = this.getFormatedDate($event)
  }

  /**
   * @func {{initClientDataServiceCall}}
   * @param \{{{string}}\} {{$authUserToken}} {{set autherized user token}}
   * @param \{{{string}}\} {{$searchKey}} {{set the data value as per type in the search input field}}
   * @param \{{{string}}\} {{$locale}} {{set locale value form localstorage lang object}}  
   * @param \{{{number}}\} {{$plan}} {{set the plan value as a number}}
   * @param \{{{string}}\} {{$status,}} {{set the is active or inactive}}
   * @param \{{{number}}\} {{$country}} {{set the value as per country id}}
   * @param \{{{string}}\} {{$exFromDate}} {{set the value as per expiration calender from date}}
   * @param \{{{string}}\} {{$exToDate}} {{set the value as per expiration calender to date}}
   * @param \{{{string}}\} {{$signedFromDate}} {{set the value as per signed calender from date}}
   * @param \{{{string}}\} {{$signedToDate}} {{set the value as per signed calender to date}}
   * @description {{this function will call all data in "ngOnInit" lifecycle hook}}
   */
  private initClientDataServiceCall($authUserToken, $searchKey, $locale, $plan, $status, $country, $exFromDate, $exToDate, $signedFromDate, $signedToDate){
    this.adminService.adminAllClientList($authUserToken, $searchKey, $locale, $plan, $status, $country, $exFromDate, $exToDate, $signedFromDate, $signedToDate)
      .subscribe(
        data =>{
          if(data.status == "success"){
            this.clientData = data.results;
            this.countryList = data.country;
            this.planList = data.subscription;
            console.log(this.clientData)
          }  
          if(data.status == "fail"){
            alert('You are not admin!')
          }
        },
        error =>{
          console.log(error)
          alert('Something went wrong!')
        }
      )
  }

  /**
   * @func {{filterClientDataServiceCall}}
   * @param \{{{string}}\} {{$authUserToken}} {{set autherized user token}}
   * @param \{{{string}}\} {{$searchKey}} {{set the data value as per type in the search input field}}
   * @param \{{{string}}\} {{$locale}} {{set locale value form localstorage lang object}}  
   * @param \{{{number}}\} {{$plan}} {{set the plan value as a number}}
   * @param \{{{string}}\} {{$status,}} {{set the is active or inactive}}
   * @param \{{{number}}\} {{$country}} {{set the value as per country id}}
   * @param \{{{string}}\} {{$exFromDate}} {{set the value as per expiration calender from date}}
   * @param \{{{string}}\} {{$exToDate}} {{set the value as per expiration calender to date}}
   * @param \{{{string}}\} {{$signedFromDate}} {{set the value as per signed calender from date}}
   * @param \{{{string}}\} {{$signedToDate}} {{set the value as per signed calender to date}}
   * @description {{this function will call whenever any change happen in the input filter boxes}}
   */
  private filterClientDataServiceCall($authUserToken, $searchKey, $locale, $plan, $status, $country, $exFromDate, $exToDate, $signedFromDate, $signedToDate){
    this.adminService.adminAllClientList($authUserToken, $searchKey, $locale, $plan, $status, $country, $exFromDate, $exToDate, $signedFromDate, $signedToDate)
      .subscribe(
        data =>{
          if(data.status == "success"){
            this.clientData = data.results;
          }  
          if(data.status == "fail"){
            alert('You are not admin!')
          }
        },
        error =>{
          console.log(error)
          alert('Something went wrong!')
        }
      )
  }

  // e.g. 1-7-2017
  private getFormatedDate($date){
    let date = new Date($date);
    let getdate = date.getDate();
    let getmonth = date.getMonth();
    let getyear = date.getFullYear();
    let fulldate = getdate + '-' + getmonth + '-' + getyear;
    return fulldate;
  }
 
  /**
   * @func {{storeClientData}}
   * @param \{{{any}}\} {{$token}} {{this will store the each user token in the session storage}}
   * @param \{{{any}}\} {{$orgId}} {{this will store the each user orgid in the session storage}}
   * @param \{{{any}}\} {{$type}} {{this will store the each user type admin or user}}
   * @param \{{{any}}\} {{$userId}} {{this will store the user id}}
   * @description {{as per this token value the route will call the service}}
   */
  private storeClientData($token, $orgId, $type, $userId, $orgName){
    sessionStorage.setItem('adminViewClient', $token);
    sessionStorage.setItem('adminViewClientOrg', $orgId);
    sessionStorage.setItem('adminViewClientType', $type);
    sessionStorage.setItem('clientUserId', $userId);
    sessionStorage.setItem('orgName', $orgName);
    // console.log(this.clientData)
  }

  /**
   * @func {{changeStatus}}
   * @param \{{{boolean}}\} {{$event}} {{this will take the input check box true or false value}}
   * @param \{{{any}}\} {{token}} {{this will take the single user token}}
   */
  private changeStatus($event, token, userId){
    // take a data object
    let userChangeData = {
      api_token: '',
      change_status: '',
      user_id: ''
    }
    // true case
    if($event === true){
      // local object modification
      userChangeData.api_token = token;
      userChangeData.change_status = 'Y';
      userChangeData.user_id = userId;
      // service method call
      this.userStatusToggleChange(userChangeData);
    }
    // false case
    if($event === false){
      // local object modification
      userChangeData.api_token = token;
      userChangeData.change_status = 'N';
      userChangeData.user_id = userId;
      // service method call
      this.userStatusToggleChange(userChangeData);
    }
  }

  /**
   * @func {{userStatusToggleChange}}
   * @param \{{{object}}\} {{userData}} {{this will pass the user data}}
   * @description {{this subscribe method the http service call}}
   */
  private userStatusToggleChange(userData){
    this.adminService.adminUserActiveInavtive(userData)
      .subscribe(
        data => {
          if(data.status === "success"){
            // initial client data list service call
            this.initClientDataServiceCall(
              this.authUser.api_token,
              this.serachOrg,
              this.locale,
              this.selectPlan,
              this.selectStatus,
              this.selectCountry,
              this.calfrmDate,
              this.caltoDate,
              this.signcalfrmDate,
              this.signcaltoDate
            )
          }
          if(data.status === "fail"){
            alert('You are not an admin!');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong');
        }
      );
  }





  /**
   * @func {{frmCall}}
   * @param \{{{string}}\} {{$data}} {{this will get the date from the calender}}
   * @description {{this function will fire as per date selected and get the filtered value}}
   */
  frmCall($data){
    this.calfrmDate = $data;
    if($data == ''){
      this.caltoDate = '';
      jQuery('#todate').val('');
      // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
      // filter http calling function called
      this.filterClientDataServiceCall(
        this.authUser.api_token,
        this.serachOrg,
        this.locale,
        this.selectPlan,
        this.selectStatus,
        this.selectCountry,
        this.calfrmDate,
        this.caltoDate,
        this.signcalfrmDate,
        this.signcaltoDate
      )
    }
    // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
    // filter http calling function called
    this.filterClientDataServiceCall(
      this.authUser.api_token,
      this.serachOrg,
      this.locale,
      this.selectPlan,
      this.selectStatus,
      this.selectCountry,
      this.calfrmDate,
      this.caltoDate,
      this.signcalfrmDate,
      this.signcaltoDate
    )
  }

  /**
   * @func {{toCall}}
   * @param \{{{string}}\} {{$data}} {{this will get the date from the calender}}
   * @description {{this function will fire as per date selected and get the filtered value}}
   */
  toCall($data){
    this.caltoDate = $data;
    // leser then checking
    let frmdate = + new Date(moment(this.calfrmDate).format());
    let todate = + new Date(moment(this.caltoDate).format()) 
    // console.log(frmdate < todate)
    if(frmdate < todate){
      // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
      // filter http calling function called
      this.filterClientDataServiceCall(
        this.authUser.api_token,
        this.serachOrg,
        this.locale,
        this.selectPlan,
        this.selectStatus,
        this.selectCountry,
        this.calfrmDate,
        this.caltoDate,
        this.signcalfrmDate,
        this.signcaltoDate
      )
    }
    else{
      if($data == ''){
        this.caltoDate = '';
        // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
        // filter http calling function called
        this.filterClientDataServiceCall(
          this.authUser.api_token,
          this.serachOrg,
          this.locale,
          this.selectPlan,
          this.selectStatus,
          this.selectCountry,
          this.calfrmDate,
          this.caltoDate,
          this.signcalfrmDate,
          this.signcaltoDate
        )
      }
      else{
        jQuery('#todate').val('');
        this.caltoDate = '';
        // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
        // filter http calling function called
        this.filterClientDataServiceCall(
          this.authUser.api_token,
          this.serachOrg,
          this.locale,
          this.selectPlan,
          this.selectStatus,
          this.selectCountry,
          this.calfrmDate,
          this.caltoDate,
          this.signcalfrmDate,
          this.signcaltoDate
        )
        alert('To date must be grater then from date.')
      }
    }
  }



  /**
   * @func {{signfrmCall}}
   * @param \{{{string}}\} {{$data}} {{this will get the date from the calender}}
   * @description {{this function will fire as per date selected and get the filtered value}}
   */
  signfrmCall($data){
    this.signcalfrmDate = $data;
    if($data == ''){
      this.signcaltoDate = '';
      jQuery('#signtodate').val('');
      // console.log('SIGN fire ajax with - ', `${this.signcalfrmDate} - ${this.signcaltoDate}` );
      // filter http calling function called
      this.filterClientDataServiceCall(
        this.authUser.api_token,
        this.serachOrg,
        this.locale,
        this.selectPlan,
        this.selectStatus,
        this.selectCountry,
        this.calfrmDate,
        this.caltoDate,
        this.signcalfrmDate,
        this.signcaltoDate
      )
    }
    // console.log('SIGN fire ajax with - ', `${this.signcalfrmDate} - ${this.signcaltoDate}` );
    // filter http calling function called
    this.filterClientDataServiceCall(
      this.authUser.api_token,
      this.serachOrg,
      this.locale,
      this.selectPlan,
      this.selectStatus,
      this.selectCountry,
      this.calfrmDate,
      this.caltoDate,
      this.signcalfrmDate,
      this.signcaltoDate
    )
  }

  /**
   * @func {{signtoCall}}
   * @param \{{{string}}\} {{$data}} {{this will get the date from the calender}}
   * @description {{this function will fire as per date selected and get the filtered value}}
   */
  signtoCall($data){
    this.signcaltoDate = $data;
    // leser then checking
    let frmdate = + new Date(moment(this.signcalfrmDate).format());
    let todate = + new Date(moment(this.signcaltoDate).format()) 
    // console.log(frmdate < todate)
    if(frmdate < todate){
      // console.log('SIGN fire ajax with - ', `${this.signcalfrmDate} - ${this.signcaltoDate}` );
      // filter http calling function called
      this.filterClientDataServiceCall(
        this.authUser.api_token,
        this.serachOrg,
        this.locale,
        this.selectPlan,
        this.selectStatus,
        this.selectCountry,
        this.calfrmDate,
        this.caltoDate,
        this.signcalfrmDate,
        this.signcaltoDate
      )
    }
    else{
      if($data == ''){
        this.signcaltoDate = '';
        // console.log('SIGN fire ajax with - ', `${this.signcalfrmDate} - ${this.signcaltoDate}` );
        // filter http calling function called
        this.filterClientDataServiceCall(
          this.authUser.api_token,
          this.serachOrg,
          this.locale,
          this.selectPlan,
          this.selectStatus,
          this.selectCountry,
          this.calfrmDate,
          this.caltoDate,
          this.signcalfrmDate,
          this.signcaltoDate
        )
      }
      else{
        jQuery('#signtodate').val('');
        this.signcaltoDate = '';
        // console.log('SIGN fire ajax with - ', `${this.signcalfrmDate} - ${this.signcaltoDate}` );
        // filter http calling function called
        this.filterClientDataServiceCall(
          this.authUser.api_token,
          this.serachOrg,
          this.locale,
          this.selectPlan,
          this.selectStatus,
          this.selectCountry,
          this.calfrmDate,
          this.caltoDate,
          this.signcalfrmDate,
          this.signcaltoDate
        )
        alert('SIGN To date must be grater then from date.')
      }
    }
  }




  /**
   * @func {{ngOnInit}}
   * @description {{this is life cycle hook}}
   */
  ngOnInit() {
    // set the auth user and store the data in the localstorage
    this.authUser = this.userService.getAuthUser();

    // get the locale value from localstorage
    this.locale = JSON.parse(localStorage.getItem("lang")).locale
    
    // initial client data list service call
    this.initClientDataServiceCall(
      this.authUser.api_token,
      this.serachOrg,
      this.locale,
      this.selectPlan,
      this.selectStatus,
      this.selectCountry,
      this.calfrmDate,
      this.caltoDate,
      this.signcalfrmDate,
      this.signcaltoDate
    )



    // get the angular scope
    var that = this;
    
    // from date data get
    jQuery('#frmdate').datetimepicker({
      timepicker:false,
      format:'Y-m-d',
      onChangeDateTime:function(dp,$input){
        let date = $input.val()
        that.frmCall(date);
      }
    });

    // to date data get
    jQuery('#todate').datetimepicker({
      timepicker:false,
      format:'Y-m-d',
      onChangeDateTime:function(dp,$input){
        let date = $input.val()
        that.toCall(date);
      }
    });

    // signed from date data get
    jQuery('#signfrmdate').datetimepicker({
      timepicker:false,
      format:'Y-m-d',
      onChangeDateTime:function(dp,$input){
        let date = $input.val()
        that.signfrmCall(date);
      }
    });

    // signed to date data get
    jQuery('#signtodate').datetimepicker({
      timepicker:false,
      format:'Y-m-d',
      onChangeDateTime:function(dp,$input){
        let date = $input.val()
        that.signtoCall(date);
      }
    });

    
  }

}

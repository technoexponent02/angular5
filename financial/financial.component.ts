import { Component, OnInit } from '@angular/core';
import {UserService} from '../../_services/user.service';
import {AdminService} from '../../_services/admin.service';

import * as config from '../../config';

// for jquery
declare var $: any;
declare var jQuery: any;
// for moment
declare var moment: any;

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{authUser}} {{store the auth user data form the localstorage}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{locale}} {{here will set the selected language value.
   *                                    this data will find "ngOnInit" lifecycle hook from localstorage}}
   */
  locale: any = "";
  /**
   * @property \{{{any}}\} {{fnResults}} {{this will store the all financial data}}
   */
  fnResults: any = [];
  /**
   * @property \{{{any}}\} {{planList}} {{this will store the subscription plan list}}
   */
  planList: any = [];
  /**
   * @property \{{{boolean}}\} {{financeDetails}} {{this will open the finance data}}
   */
  financeDetails: boolean = false;
  /**
   * @property \{{{any}}\} {{singleFinanceData}} {{this will store the single data object}}
   */
  singleFinanceData: any = []
  /**
   * @property \{{{any}}\} {{searchKey}} {{this will hold the as per search input value field store the value}}
   */
  searchKey: any = '';
  /**
   * @property \{{{any}}\} {{selectedPlan}} {{this will choose the selected plan}}
   */
  selectedPlan: any = 0;
  /**
   * @property \{{{any}}\} {{selectedStatus}} {{this will set the status as per client select the status}}
   */
  selectedStatus: any = 0;

  calfrmDate: any = '';
  caltoDate: any = '';

  apiurl: any = config.api_base_url;


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
   * @func {{detailFinance}}
   * @param \{{{object}}\} {{$data}} {{this will pass the single data object}}
   * @description {{this will open the popup and store the data for the view details}}
   */
  detailFinance($data){
    // open the details popup
    this.financeDetails = true;
    // store the details data
    console.log($data);
    this.singleFinanceData = $data;
  }

  /**
   * @func {{clientNameSearch}}
   * @description {{this function will fire on keyup when user started to searching the search input box}}
   */
  clientNameSearch(){
    // filter service call by this method
    if(this.searchKey == ''){
      this.filterFinancialServiceCall(
        this.authUser.api_token,
        this.searchKey,
        this.locale,
        this.selectedPlan,
        this.selectedStatus,
        this.calfrmDate,
        this.caltoDate
      );
    }
    
  }

  /**
   * @func {{planNameSearch}}
   * @description {{this function will fire on plan select dropdown on change}}
   */
  planNameSearch(){
    // filter service call by this method
    if(this.selectedPlan == 0){
      this.filterFinancialServiceCall(
        this.authUser.api_token,
        this.searchKey,
        this.locale,
        this.selectedPlan,
        this.selectedStatus,
        this.calfrmDate,
        this.caltoDate
      );
    }
  }

  /**
   * @func {{statusNameSearch}}
   * @description {{this function will fire when status change select dropdown on change}}
   */
  statusNameSearch(){
    // filter service call by this method
    if(this.selectedStatus == 0){
      this.filterFinancialServiceCall(
        this.authUser.api_token,
        this.searchKey,
        this.locale,
        this.selectedPlan,
        this.selectedStatus,
        this.calfrmDate,
        this.caltoDate
      );
    }
  }

  /**
   * @func {{searchPlan}}
   * @description {{this will search the filter the search plan as per data}}
   */
  searchPlan(){
    // filter service call by this method
    this.filterFinancialServiceCall(
      this.authUser.api_token,
      this.searchKey,
      this.locale,
      this.selectedPlan,
      this.selectedStatus,
      this.calfrmDate,
      this.caltoDate
    );
  }

  /**
   * @func {{filterFinancialServiceCall}}
   * @param \{{{string}}\} {{$token}} {{set autherized user token}}
   * @param \{{{string}}\} {{$searchKey}} {{set the data value as per type in the search input field}}
   * @param \{{{string}}\} {{$locale}} {{set locale value form localstorage lang object}}  
   * @param \{{{number}}\} {{$plan}} {{set the plan value as a number}}
   * @param \{{{string}}\} {{$status}} {{set the is active or inactive}}
   * @param \{{{string}}\} {{$frmdate}} {{this will send the from date}}
   * @param \{{{string}}\} {{$todate}} {{this will send the to date}}
   * @description {{this function will filter on change and get ajax response over time}}
   */
  private filterFinancialServiceCall($token, $searchKey, $locale, $plan, $status, $frmdate, $todate){
    this.adminService.adminFinancialList($token, $searchKey, $locale, $plan, $status, $frmdate, $todate)
      .subscribe(
        data => {
          // console.log(data);
          if(data.status == "success"){
            this.fnResults = data.results;
          }
          if(data.status == "fail"){
            alert('You are not admin!')
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }


  /**
   * @func {{initialFinancialServiceCall}}
   * @param \{{{string}}\} {{$token}} {{set autherized user token}}
   * @param \{{{string}}\} {{$searchKey}} {{set the data value as per type in the search input field}}
   * @param \{{{string}}\} {{$locale}} {{set locale value form localstorage lang object}}  
   * @param \{{{number}}\} {{$plan}} {{set the plan value as a number}}
   * @param \{{{string}}\} {{$status}} {{set the is active or inactive}}
   * @param \{{{string}}\} {{$frmdate}} {{this will send the from date}}
   * @param \{{{string}}\} {{$todate}} {{this will send the to date}}
   * @description {{this function will fire for the first time and get the all financial data}}
   */
  private initialFinancialServiceCall($token, $searchKey, $locale, $plan, $status, $frmdate, $todate){
    this.adminService.adminFinancialList($token, $searchKey, $locale, $plan, $status, $frmdate, $todate)
      .subscribe(
        data => {
          // console.log(data);
          if(data.status == "success"){
            this.fnResults = data.results;
            this.planList = data.subscription;
            console.log(this.fnResults, this.planList);
          }
          if(data.status == "fail"){
            alert('You are not admin!')
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }



  /**
   * @func {{frmCall}}
   * @param \{{{string}}\} {{$data}} {{this will take tahe date string value}}
   * @description {{this will fire on change the calender}}
   */
  frmCall($data){
    this.calfrmDate = $data;
    if($data == ''){
      this.caltoDate = '';
      jQuery('#todate').val('');
      // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
      // filter service call by this method
      this.filterFinancialServiceCall(
        this.authUser.api_token,
        this.searchKey,
        this.locale,
        this.selectedPlan,
        this.selectedStatus,
        this.calfrmDate,
        this.caltoDate
      );
    }
    // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
  }

  /**
   * @func {{toCall}}
   * @param \{{{string}}\} {{$data}} {{this will take tahe date string value}}
   * @description {{this will fire on change the calender}}
   */
  toCall($data){
    this.caltoDate = $data;
    // leser then checking
    let frmdate = + new Date(moment(this.calfrmDate).format());
    let todate = + new Date(moment(this.caltoDate).format()) 
    // console.log(frmdate < todate)
    if(frmdate < todate){
      // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
    }
    else{
      if($data == ''){
        this.caltoDate = '';
        // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
        // filter service call by this method
        this.filterFinancialServiceCall(
          this.authUser.api_token,
          this.searchKey,
          this.locale,
          this.selectedPlan,
          this.selectedStatus,
          this.calfrmDate,
          this.caltoDate
        );
      }
      else{
        jQuery('#todate').val('');
        this.caltoDate = '';
        // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
        // filter service call by this method
        this.filterFinancialServiceCall(
          this.authUser.api_token,
          this.searchKey,
          this.locale,
          this.selectedPlan,
          this.selectedStatus,
          this.calfrmDate,
          this.caltoDate
        );
        alert('To date must be grater then from date.')
      }
    }
  }


  /**
   * @func {{goToOrg}}
   * @param \{{{object}}\} {{$data}} {{get the organaization object here}}
   * @description {{set the organaization data to a localstorage}}
   */
  goToOrg($data){
    // make json stringify
    let orgData = JSON.stringify($data);
    // set in the session storage
    sessionStorage.setItem('orgData', orgData);
  }





  /**
   * @func {{ngOnInit}}
   * @description {{This is on init lifecycle hook}}
   */
  ngOnInit() {
    // set the auth user and store the data in the localstorage
    this.authUser = this.userService.getAuthUser();
    // get the locale value from localstorage
    this.locale = JSON.parse(localStorage.getItem("lang")).locale;

    // initial service call for initializing first time call
    this.initialFinancialServiceCall(
      this.authUser.api_token,
      this.searchKey,
      this.locale,
      this.selectedPlan,
      this.selectedStatus,
      this.calfrmDate,
      this.caltoDate
    );



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


  }

}

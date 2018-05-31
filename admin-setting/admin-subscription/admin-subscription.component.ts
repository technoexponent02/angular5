import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../_services/user.service';
import {AdminService} from '../../../_services/admin.service';

import {Message} from 'primeng/primeng';

// for jquery
declare var $: any;

@Component({
  selector: 'app-admin-subscription',
  templateUrl: './admin-subscription.component.html',
  styleUrls: ['./admin-subscription.component.css']
})
export class AdminSubscriptionComponent implements OnInit {
  /**
   * @property \{{{Message[]}}\} {{allMessage}} {{This is used from "primeng" plugin growl notification}}
   */
  allMessage: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{store the auth user data from the localstorage}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{lang}} {{store the full lang object values from the localstorage}}
   */
  lang: any;
  /**
   * @property \{{{any}}\} {{subscriptionFullData}} {{store the full object data for the subscription page}}
   */
  subscriptionFullData: any = [];
  /**
   * @property \{{{any}}\} {{defaultCurrency}} {{store the default currency object}}
   */
  defaultCurrency: any = [];
  /**
   * @property \{{{any}}\} {{countryList}} {{store the full list of countries}}
   */
  countryList: any = [];
  /**
   * @property \{{{any}}\} {{featureList}} {{store the all features item in this property}}
   */
  featureList: any = [];
  /**
   * @property \{{{type}}\} {{allPlanList}} {{store the all plan list}}
   */
  allPlanList: any = '';
  /**
   * @property \{{{any}}\} {{addPlanObj}} {{make the add plan post object on init}}
   */
  addPlanObj: any;
  /**
   * @property \{{{boolean}}\} {{addPlanFormToggle}} {{this will toggle the add form and edit form}}
   */
  addPlanFormToggle: any = true;
  /**
   * @property \{{{any}}\} {{singleSubscription}} {{this will store the single subscription object as per id}}
   */
  singleSubscription: any = [];
  /**
   * @property \{{{any}}\} {{storeSingleProductId}} {{store single product id}}
   */
  storeSingleProductId: any;
  /**
   * @property \{{{any}}\} {{editPlanObj}} {{make the edit plan post object}}
   */
  editPlanObj: any;


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
   * @func {{getFullSubscriptionData}}
   * @param \{{{string}}\} {{$apiToken}} {{this will get the api_token from the localstorage}}
   * @param \{{{string}}\} {{$locale}} {{this will get the locale from the localstorage}}
   * @description {{this will make the initial service call for get the full subscription data object}}
   */
  private getFullSubscriptionData($apiToken, $locale){
    this.adminService.adminSubscriptionFullData($apiToken, $locale)
      .subscribe(
        data => {
          $('.setting-http-load, .linear-progress').fadeOut();
          // console.log(data);
          if(data.status === "success"){
            // store the all data
            this.subscriptionFullData = data;
            // store the default currency object
            this.defaultCurrency = data.default_currency;
            // set the country list object
            this.countryList = data.countries;
            // set the features list object
            this.featureList = data.features;
            // set the all plan list
            this.allPlanList = data.subscriptionlist;
            // loader remove
            $('.setting-http-load').fadeOut();
          }
          if(data.status === "fail"){
            alert('You are not an admin');
          }
        },
        error =>{
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{editPlan}}
   * @param \{{{object}}\} {{$event}} {{this will take single plan data}}
   * @description {{this will return the single plan object}}
   */
  editPlan($event){
    // toggle between the add and edit form
    this.addPlanFormToggle = false;
    // console.log($event.id);
    // store the id as per object id
    this.storeSingleProductId = $event.id;
    this.adminService.adminSubscriptionSingleEdit(this.authUser.api_token, this.lang.locale, $event.id)
      .subscribe(
        data => {
          // console.log(data);
          if(data.status === "success"){
            // set the country list object
            this.countryList = data.countries;
            // set the features list object
            this.featureList = data.features;
            // single subscription object
            this.singleSubscription = data.subscription;

            // remove the inner html in the feature list
            $('.editfeaturelist').empty();
            // feature list rending
            // we cant able to use *ngfor because next loop not working there
            for (let i = 0; i < this.featureList.length; i++) {
                let id = this.featureList[i].id;
                let name = this.featureList[i].name;
                let inputId = 'editfe-' + id;
                // template rendering
                $('.editfeaturelist').append(`<div class="form-group clearfix col-lg-6 col-md-6 col-sm-6 col-xs-6 col-xs-lg-4 col-xs-md-4 add-feature-wrap-edit">
										<label class="checkFld pull-left">                                
											<input type="checkbox" [checked]="true" name="feture" id="${inputId}" value="${id}">
											<i class="fa fa-square-o"></i>
											${name}
										</label>
									</div>`)
            }

            // checking as per value the list is render
            for (let i = 0; i < this.singleSubscription.subscription_feture.length; i++) {
                let id = this.singleSubscription.subscription_feture[i].feture_id;
                let inputId = '#editfe-' + id;
                $('#editfe-' + id).attr('checked', true);
            }

            // remove the inner html in the country list
            $('.editCountryList').empty();
            // country list rending
            // we cant able to use *ngfor because next loop not working there
            for (let i = 0; i < this.countryList.length; i++) {
                let id = this.countryList[i].id;
                let name = this.countryList[i].name;
                let inputId = 'editcountry-' + id;
                // template rendering
                $('.editCountryList').append(`<tr>
												<td class="countrylist-edit">
													<label class="checkFld pull-left">                                
													<input type="checkbox" name="remember" id="${inputId}" value="${id}">
													<i class="fa fa-square-o"></i></label>
												</td>
												<td>${name}</td>
											</tr>`)
            }

            // checking as per value the list is render
            for (let i = 0; i < this.singleSubscription.subscription_country.length; i++) {
                let id = this.singleSubscription.subscription_country[i].country_id;
                let inputId = '#editcountry-' + id;
                $('#editcountry-' + id).attr('checked', true);
            }

          }
          if(data.status === "fail"){
            alert('You are not an admin')
          }
        },
        error => {
          console.log(error)
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{editPlanPost}}
   * @description {{edit single plan and post}}
   */
  editPlanPost(){
    // edit plan object create for post
    this.editPlanObj = {
      api_token: this.authUser.api_token,
      locale: this.lang.locale,
      status: this.singleSubscription.status,
      id: this.storeSingleProductId,
      name: this.singleSubscription.name,
      amount_monthly: this.singleSubscription.amount_monthly,
      yearly_discount: this.singleSubscription.yearly_discount,
      maximum_tour: this.singleSubscription.maximum_tour,
      maximum_users: this.singleSubscription.maximum_users,
      sences_per_tour: this.singleSubscription.sences_per_tour,
      note: this.singleSubscription.note
    }


    /**
     * @description {{this is the logic for add features}}
     */
    // store array values make it blank initial
    let checkedValueArr = [];
    // each function for get value from checkbox
    $('.add-feature-wrap-edit').each(function(i, el){
      let inputCheckbox = $(this).find('input');
      if($(inputCheckbox).is(":checked")){
        // console.log(inputCheckbox.attr('value'));
        checkedValueArr.push(inputCheckbox.attr('value'))
      }
    })
    // set the feature values as per checked
    this.editPlanObj.feature = checkedValueArr;

    /**
     * @description {{this is the logic for add countries}}
     */
    // store array values make it blank initial
    let checkedCountryValueArr = [];
    // each function for get value from checkbox
    $('.countrylist-edit').each(function(i, el){
      let inputCheckboxCountry = $(this).find('input');
      if($(inputCheckboxCountry).is(":checked")){
        // console.log(inputCheckboxCountry.attr('value'));
        checkedCountryValueArr.push(inputCheckboxCountry.attr('value'));
      }
    })
    // set the country values as per checked
    this.editPlanObj.country = checkedCountryValueArr;


    // edit process service call
    this.adminService.adminSubscriptionPlanEditPost(this.editPlanObj)
      .subscribe(
        data => {
          if(data.status === "success"){
            // message push on the growl
            this.allMessage = [];
            this.allMessage.push({severity:'success', summary:'Success', detail: 'Plan is now updated'});
            // initial api call for fetching all data by service call
            this.getFullSubscriptionData(this.authUser.api_token, this.lang.locale);
            this.addPlanFormToggle = true;
          }
          if(data.status === "fail"){
            alert('validation error');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!')
        }
      );


    // console.log(this.editPlanObj);

  }

  /**
   * @func {{deletePlan}}
   * @param \{{{event object}}\} {{$event}} {{this will get the id from the particular plan}}
   * @desc {{this method will delete the plan from the plan list}}
   */
  deletePlan($event){
    // console.log(this.authUser.api_token, $event.id);
    this.adminService.adminSubscriptionDelete(this.authUser.api_token, $event.id)
      .subscribe(
        data => {
          // // initial api call for fetching all data by service call
          if(data.status == "sorry this subscription currently activated for some user"){
            alert(data.status);
          } else {
            this.getFullSubscriptionData(this.authUser.api_token, this.lang.locale);
            // // message push on the growl
            this.allMessage = [];
            this.allMessage.push({severity:'success', summary:'Success', detail: 'A plan deleted successfully'});
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{addPlan}}
   * @description {{this will add the plan by service call and subscribe}}
   */
  addPlan(){
    // console.log(this.addPlanObj)
    /**
     * @description {{this is the logic for add features}}
     */
    // store array values make it blank initial
    let checkedValueArr = [];
    // each function for get value from checkbox
    $('.add-feature-wrap').each(function(i, el){
      let inputCheckbox = $(this).find('input');
      if($(inputCheckbox).is(":checked")){
        // console.log(inputCheckbox.attr('value'));
        checkedValueArr.push(inputCheckbox.attr('value'))
      }
    })
    // set the feature values as per checked
    this.addPlanObj.feature = checkedValueArr;

    /**
     * @description {{this is the logic for add countries}}
     */
    // store array values make it blank initial
    let checkedCountryValueArr = [];
    // each function for get value from checkbox
    $('.countrylist').each(function(i, el){
      let inputCheckboxCountry = $(this).find('input');
      if($(inputCheckboxCountry).is(":checked")){
        // console.log(inputCheckboxCountry.attr('value'));
        checkedCountryValueArr.push(inputCheckboxCountry.attr('value'));
      }
    })
    // set the country values as per checked
    this.addPlanObj.country = checkedCountryValueArr;

    // post full data by service call
    this.adminService.adminSubscriptionPlanAdd(this.addPlanObj)
      .subscribe(
        data => {
          // console.log(data);
          if(data.status === "success"){
            // message push on the growl
            this.allMessage = [];
            this.allMessage.push({severity:'success', summary:'Success', detail: 'A new plan added'});
            // alert('Plan added successfully.');
            // initial api call for fetching all data by service call
            this.getFullSubscriptionData(this.authUser.api_token, this.lang.locale);
            // reseting the state
            // add plan object create for post
            // this.addPlanObj = {
            //   api_token: this.authUser.api_token,
            //   locale: this.lang.locale,
            //   status: 1
            // }
            // need reloading otherwise form field is required visible
            setTimeout(()=>{
              location.reload()
            }, 2000)
            
          }
          if(data.status === "fail"){
            alert('Need to done validation error message')
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{allCountryAdd}}
   * @description {{select all input country}}
   */
  allCountryAdd(){
    $('.countrylist').find('input').attr('checked', true)
  }

  /**
   * @func {{allCountryNo}}
   * @description {{deselect all input country}}
   */
  allCountryNo(){
    $('.countrylist').find('input').attr('checked', false)
  }

  /**
   * @func {{allCountryEdit}}
   * @description {{select all input country in edit form}}
   */
  allCountryEdit(){
    $('.countrylist-edit').find('input').attr('checked', true)
  }

  /**
   * @func {{allCountryEditNo}}
   * @description {{deselect all input country in edit form}}
   */
  allCountryEditNo(){
    $('.countrylist-edit').find('input').attr('checked', false)
  }

  /**
   * @func {{ngOnInit}}
   * @description {{This is on init lifecycle hook}}
   */
  ngOnInit() {
    // set the auth user and store the data in the localstorage
    this.authUser = this.userService.getAuthUser();
    // set the user lang value get the data from localstorage
    this.lang = JSON.parse(localStorage.getItem('lang'));
    // initial api call for fetching all data by service call
    this.getFullSubscriptionData(this.authUser.api_token, this.lang.locale);

    // add plan object create for post
    this.addPlanObj = {
      api_token: this.authUser.api_token,
      locale: this.lang.locale,
      status: 1,
    }

  }

}

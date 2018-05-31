import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../../_services/user.service';
import {AdminService} from '../../../_services/admin.service';

import {Message} from 'primeng/primeng';

// for jquery
declare var $: any;
// for moment
declare var moment: any;

@Component({
  selector: 'app-client-subscription',
  templateUrl: './client-subscription.component.html',
  styleUrls: ['./client-subscription.component.css']
})
export class ClientSubscriptionComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{userLang}} {{this will store the locale value}}
   */
  userLang: any;
  /**
   * @property \{{{any}}\} {{id}} {{this is where we store diffrent user token}}
   */
  private id;
  /**
   * @property \{{{any}}\} {{queryObj}} {{this will get the query data from the url}}
   */
  queryObj:any;
  /**
   * @property \{{{any}}\} {{planData}} {{this will hold the all plan data}}
   */
  planData: any = [];
  /**
   * @property \{{{any}}\} {{userInformation}} {{this will store the user information data}}
   */
  userInformation: any = [];
  /**
   * @property \{{{any}}\} {{orgId}} {{this will take the user org id from param}}
   */
  orgId: any = '';
  /**
   * @property \{{{boolean}}\} {{paymentPop}} {{this will store the payment popup state}}
   */
  paymentPop: boolean = false;
  /**
   * @property \{{{any}}\} {{stripePaymentData}} {{this will hold the single plan data}}
   */
  stripePaymentData: any;
  /**
   * @property \{{{any}}\} {{planTotal}} {{here will update the calculated data}}
   */
  planTotal:any;
  /**
   * @property \{{{any}}\} {{currentDate}} {{this property will store the current date}}
   */
  currentDate: any = moment().add(0, 'months').format();
  /**
   * @property \{{{any}}\} {{planExpiryDate}} {{this will hold the plan expiry date}}
   */
  planExpiryDate: any;
  /**
   * @property \{{{Message}}\} {{stripemsgs}} {{stripe error or success message}}
   */
  stripemsgs: Message[] = [];
  /**
   * @property \{{{Message}}\} {{paymentemsgs}} {{payment error or success message}}
   */
  paymentemsgs: Message[] = [];
  /**
   * @property \{{{boolean}}\} {{processingPayment}} {{this will appare the processing the payment}}
   */
  processingPayment: boolean = false;
  /**
   * @property \{{{type}}\} {{onPaymentBtn}} {{this will show the payment btn}}
   */
  onPaymentBtn: boolean = true;
  /**
   * @property \{{{string}}\} {{cardNumber}} {{this will hold the card number}}
   */
  cardNumber: string;
  /**
   * @property \{{{string}}\} {{expiryMonth}} {{this will hold the card expiry month}}
   */
  expiryMonth: string;
  /**
   * @property \{{{string}}\} {{expiryYear}} {{this will hold the card expiry year}}
   */
  expiryYear: string;
  /**
   * @property \{{{string}}\} {{cvc}} {{this will hold the card cvc code}}
   */
  cvc: string;
  /**
   * @property \{{{any}}\} {{planExpireIsWas}} {{this will set the message will and was}}
   */
  planExpireIsWas: any = '';
  /**
   * @property \{{{boolean}}\} {{paymentthanks}} {{this will say thank you payment}}
   */
  paymentthanks: boolean = false;
  /**
   * @property \{{{any}}\} {{adminAssignPlan}} {{this will store the admin assign single plan data}}
   */
  adminAssignPlan: any = [];
  /**
   * @property \{{{any}}\} {{paidPlanData}} {{this will hold the paid plan data}}
   */
  paidPlanData: any = '';



  isDisabled: boolean= true;
  freeplanmsg: Message[] = [];
  notFreeCurrent: boolean = true;
  expirePlanDate: any = '';
  firstUserPlanBtn: boolean = false;



  /**
   * @constructor
   * @description {{here push the DI}}
   */
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ){}


  /**
   * @func {{checkDateisGrater}}
   * @description {{this will check the current date is grter then expiri date}}
   */
  private checkDateisGrater(){
    if(this.userInformation.user.subscription_plan.expiration_date == null){
      this.firstUserPlanBtn = true;
    } else {
      let currentDate = + new Date(moment().format());
      let expiriDate = + new Date(moment(this.userInformation.user.subscription_plan.expiration_date).format());
      // console.log(currentDate > expiriDate);
      // console.log(currentDate , expiriDate);
      // was
      this.planExpireIsWas = "Plan will expire";
      // show the upgrade and downgrade button
      if(currentDate > expiriDate){
        this.onPaymentBtn = false;
        this.planExpireIsWas = "Plan was expired";
      }
    }
  }

  /**
   * @func {{getAllSubscribtion}}
   * @param \{{{string}}\} {{$token}} {{here need to pass auth user token}}
   * @param \{{{string}}\} {{$locale}} {{here need to pass lang locale value}}
   * @param \{{{number}}\} {{$orgId}} {{here need to pass auth orgId value}}
   * @description {{this method will get all the plans by the service call}}
   */
  private getAllSubscribtion($token, $locale, $orgId){
    this.userService.getSubscriptionData($token, $locale, $orgId)
      .subscribe(
        data => {
          // data is assigned in the property
          this.planData = data.allSubscriptionsPlans;
          this.userInformation = data.user_information;
          console.log(this.planData, this.userInformation);

          if(data.user_information.user.subscription_plan == null){
            this.expirePlanDate = '';
          } else {
            this.expirePlanDate = moment(this.userInformation.user.subscription_plan.expiration_date).format("MMM Do YYYY");
            // plan expire date check
            this.checkDateisGrater();
          }
          // this.expirePlanDate = moment(this.userInformation.user.subscription_plan.expiration_date).format("MMM Do YYYY");
          
          // remove loader progress
          $('.setting-http-load, .linear-progress').fadeOut()
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{adminUpgradePlan}}
   * @param \{{{eventDataObject}}\} {{$plan}} {{this will get the data from the current plan that clicked}}
   * @param \{{{eventObject}}\} {{$event}} {{thiw ill take the event object data}}
   */
  adminUpgradePlan($plan, $event){
    // assign the data for stripe plan data
    let plan = $plan;
    // if free plan
    if($plan.amount_monthly == 0){
      // // make the local payment object
      // let subscriptionObj = {
      //   user_id:this.userInformation.user_id,
      //   payment_for:'Admin Payment',
      //   id:this.userInformation.user.subscription_plan.id,
      //   org_id: this.orgId,
      //   subscription_id:plan.id,
      //   date_signed: this.currentDate,
      //   expiration_date: moment().add(1, 'months').format(),
      //   api_token:this.id,
      //   amount: 0
      // }
      // console.log(subscriptionObj)
      // // free plan service call
      // this.freePlan(subscriptionObj);

      // make the local payment object
      if(this.userInformation.user.subscription_plan == null){
        let subscriptionObj = {
          user_id:this.userInformation.user_id,
          payment_for:'Admin Payment',
          id:'',
          org_id: this.orgId,
          subscription_id:plan.id,
          date_signed: this.currentDate,
          expiration_date: moment().add(1, 'months').format(),
          api_token:this.id,
          amount: 0
        }
        console.log(subscriptionObj)
        // free plan service call
        this.freePlan(subscriptionObj);

      }
      else {
        let subscriptionObj = {
          user_id:this.userInformation.user_id,
          payment_for:'Admin Payment',
          id:this.userInformation.user.subscription_plan.id,
          org_id: this.orgId,
          subscription_id:plan.id,
          date_signed: this.currentDate,
          expiration_date: moment().add(1, 'months').format(),
          api_token:this.id,
          amount: 0
        }
        console.log(subscriptionObj)
        // free plan service call
        this.freePlan(subscriptionObj);
      }

    }
    else{
      // popup open by doing state change
      this.paymentPop = true;
      // assign the data for current plan data
      this.adminAssignPlan = $plan;
      // this will make the total payment data
      this.planTotal = $plan.amount_monthly;

      // // make the local payment object
      // this.paidPlanData = {
      //   "user_id":this.userInformation.user_id,
      //   "payment_for":'Admin Payment',
      //   "id":this.userInformation.user.subscription_plan.id,
      //   "org_id": this.orgId,
      //   "subscription_id":plan.id,
      //   "date_signed": this.currentDate,
      //   "expiration_date": this.planExpiryDate,
      //   "api_token":this.id,
      //   "amount": ''
      // }

      // make the local payment object
      if(this.userInformation.user.subscription_plan == null){
        this.paidPlanData = {
          "user_id":this.userInformation.user_id,
          "payment_for":'Admin Payment',
          "id":'',
          "org_id": this.orgId,
          "subscription_id":plan.id,
          "date_signed": this.currentDate,
          "expiration_date": this.planExpiryDate,
          "api_token":this.id,
          "amount": ''
        }
      }
      else{
        this.paidPlanData = {
          "user_id":this.userInformation.user_id,
          "payment_for":'Admin Payment',
          "id":this.userInformation.user.subscription_plan.id,
          "org_id": this.orgId,
          "subscription_id":plan.id,
          "date_signed": this.currentDate,
          "expiration_date": this.planExpiryDate,
          "api_token":this.id,
          "amount": ''
        }
      }

      // add total plan and expiration date
      this.paidPlanData.amount = this.planTotal;
      this.paidPlanData.expiration_date = moment().add(1, 'months').format();

      // yearly is checked or not
      if($('#yarlyplan').is(':checked')){
        this.yearlyDiscount(this.adminAssignPlan);
      }
      // monthly is checked or not
      if($('#monthlyplan').is(':checked')){
        this.monthlyDiscount(this.adminAssignPlan);
      }
    }
  }


  /**
   * @func {{yearlyDiscount}}
   * @param \{{{number}}\} {{$data}} {{this will take the yearly discount price}}
   * @description {{this function will done the yearly updated price with discount}}
   */
  yearlyDiscount($data){
    // console.log($data.amount_monthly*12);
    // get total price
    let totalYearlyPrice = $data.amount_monthly*12;
    // discount amount
    let totalDiscountPrice = totalYearlyPrice * ($data.yearly_discount/100);
    // assign plan data
    this.planTotal = totalYearlyPrice - totalDiscountPrice;
    // yearly date assign
    this.planExpiryDate = moment().add(1, 'years').format();

    // add total plan and expiration date
    this.paidPlanData.amount = totalYearlyPrice - totalDiscountPrice;
    this.paidPlanData.expiration_date = this.planExpiryDate;
  }

  /**
   * @func {{monthlyDiscount}}
   * @param \{{{number}}\} {{$data}} {{this will take the monthly discount price}}
   * @description {{this function will done the monthly updated price with discount}}
   */
  monthlyDiscount($data){
    // console.log($data);
    // set monthly amount again
    this.planTotal = $data.amount_monthly;
    // monthly date assign
    this.planExpiryDate = moment().add(1, 'months').format();

    // add total plan and expiration date
    this.paidPlanData.amount = $data.amount_monthly;
    this.paidPlanData.expiration_date = this.planExpiryDate;
    // console.log(this.paidPlanData.amount)
  }


  /**
   * @func {{paidPlan}}
   * @param \{{{object}}\} {{$$paidSubs}} {{this will send the paid plan data object}}
   * @description {{this will post the paid plan data}}
   */
  private paidPlan(){
    // console.log(this.planTotal, this.planExpiryDate);
    // console.log(this.paidPlanData)
    this.userService.postFreeSubscribtion(this.paidPlanData)
      .subscribe(
        data => {
          // console.log(data);
          // message for sucess
          this.freeplanmsg.push({severity:'success', summary:'Success Message', detail:'Subscription plan updated'});
          // get the all plan list again
          // this.getAllSubscribtion(this.authUser.api_token, this.userLang.locale, this.authUser.org_id);
          // reload the screen after two second
          setTimeout(() => { location.reload(); }, 2000);
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{freePlan}}
   * @param \{{{object}}\} {{$freeSubs}} {{this will send the free plan data object}}
   * @description {{this will post the free plan data}}
   */
  private freePlan($freeSubs){
    this.userService.postFreeSubscribtion($freeSubs)
      .subscribe(
        data => {
          // console.log(data);
          // message for sucess
          this.freeplanmsg.push({severity:'success', summary:'Success Message', detail:'Subscription plan updated'});
          // get the all plan list again
          // this.getAllSubscribtion(this.authUser.api_token, this.userLang.locale, this.authUser.org_id);
          // reload the screen after two second
          setTimeout(() => { location.reload(); }, 2000);
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }


  /**
   * @func {{ngOnInit}}
   * @description {{this lifecycle hook}}
   */
  ngOnInit() {
    // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();

    // get the locale from the local storage
    this.userLang = JSON.parse(localStorage.getItem('lang'))

    // get the data from the query param
    this.route.queryParamMap.subscribe(params => {
      // store the param data in the this local query obj
      this.queryObj = {...params.keys, ...params};

      // console.log(this.userLang)

      // set the id
      this.id = this.queryObj.params.token;
      // set the org id
      this.orgId = this.queryObj.params.org_id;

      // api call for get all subscription data
      this.getAllSubscribtion(this.id, this.userLang.locale, this.orgId);

    });
  }

}

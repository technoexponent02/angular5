import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../../_services/user.service';

import * as config from '../../../config';

import {Message} from 'primeng/primeng';

// for jquery
declare var $: any;
// for moment
declare var moment: any;
// for paypal
declare let paypal: any;

// var interval;

@Component({
  selector: 'subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{userLang}} {{this will store the locale value}}
   */
  userLang: any;
  /**
   * @property \{{{any}}\} {{planData}} {{this will hold the all plan data}}
   */
  planData: any = [];
  /**
   * @property \{{{any}}\} {{userInformation}} {{this will store the user information data}}
   */
  userInformation: any = [];
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
   * @property \{{{Message}}\} {{freeplanmsgs}} {{free plan message}}
   */
  isDisabled: boolean= true;
  freeplanmsg: Message[] = [];
  notFreeCurrent: boolean = true;
  expirePlanDate: any = '';
  firstUserPlanBtn: boolean = false;

  // expiration_date: any;

  /**
   * @property \{{{boolean}}\} {{stripePay}} {{this will set the payment method}}
   */
  stripePay: boolean = true;
  /**
   * @property \{{{any}}\} {{paypalNotifyUrl}} {{this will be the paypal notify url}}
   */
  paypalNotifyUrl: any = '';
  /**
   * @property \{{{any}}\} {{paypalFailUrl}} {{this will be the paypal fail url}}
   */
  paypalFailUrl: any = '';
  /**
   * @property \{{{any}}\} {{paypalSuccessUrl}} {{this will be the paypal success url}}
   */
  paypalSuccessUrl: any = '';
  /**
   * @property \{{{any}}\} {{paypalSuccessId}} {{this will store the paypalpayment success id}}
   */
  paypalSuccessId: any = '';


  paypalPaymentUrl: any = '';

  notAgainMonthlyYearly: boolean = true;

  invalidAmount: boolean = false;

  cf: any = '';

  paymentData: any;

  secondTimeBuyUpgrade: boolean = false;

  thankyoupop: boolean = false;





  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private userService: UserService,
    private _zone: NgZone,
    private router: Router
  ) {}



  /**
   * @func {{expressPaypal}}
   * @param \{{{number}}\} {{price}} {{this will take the palan total value}}{{}}
   * @description {{this will render the paypal button and started the payment process}}
   */
  private expressPaypal(price){
    $('#paypal-button-container').empty()

    // scope confilct thats why take that = this
    var that = this;
    function sendToBackEnd(data){
      // console.log(data, 'fu')
      that.madePaypalPayment(data)
    }

    paypal.Button.render({
      
        env: 'sandbox', // sandbox | production

        // PayPal Client IDs - replace with your own
        // Create a PayPal app: https://developer.paypal.com/developer/applications/create
        client: {
            sandbox:    'AXme3MfAkCcQYu1gwIg6wvjyXQaJku8fchITNKs23Moqep8RaDg-uifvLXX6sM4kPO544RTZspVZgyhN',
            production: '<insert production client id>'
        },

        // Show the buyer a 'Pay Now' button in the checkout flow
        commit: true,

        // payment() is called when the button is clicked
        payment: function(data, actions) {

            // Make a call to the REST api to create the payment
            return actions.payment.create({
                payment: {
                    intent: "sale",
                    transactions: [
                        {
                            amount: { total: price, currency: 'USD' }
                        }
                    ],
                    redirect_urls: {
                      return_url: "https://remarsovr.com/paypal-payment-success",
                      cancel_url: "https://remarsovr.com/paypal-payment-fail"
                    }
                }
            });
        },

        // onAuthorize() is called when the buyer approves the payment
        onAuthorize: function(data, actions) {

            // Make a call to the REST api to execute the payment
            return actions.payment.execute().then(function() {
                // window.alert('Payment Complete!');
                sendToBackEnd(data);
                // console.log(data, 'first')
            });
        }

    }, '#paypal-button-container');
  }


  /**
   * @func {{madePaypalPayment}}
   * @param \{{{object}}\} {{$paypaldata}} {{this will get after paypal give token and payerid}}
   * @description {{get paypal data and send to backend}}{{}}
   */
  private madePaypalPayment($paypaldata){

    // local object for paypal payment
    let paypalPaymentObj: any = {
      user_id: this.authUser.id,
      org_id: this.authUser.org_id,
      subscription_id: this.stripePaymentData.id,
      amount: this.planTotal,
      date_signed: this.currentDate,
      expiration_date: this.planExpiryDate,
      effect_on: this.cf
    }

    // checking for downgrade plan for the future plan
    if(this.cf == 'F'){
      paypalPaymentObj.date_signed = this.userInformation.user.subscription_plan.expiration_date;
      // month checking for future plan
      if($('#monthlyplan').prop('checked')){
        // console.log('MM')
        paypalPaymentObj.expiration_date = moment(paypalPaymentObj.date_signed).add(1, 'month').format();
      }
      // year checking for future plan
      if($('#yarlyplan').prop('checked')){
        // console.log('YY')
        paypalPaymentObj.expiration_date = moment(paypalPaymentObj.date_signed).add(1, 'years').format();
      }

    }

    // console.log(paypalPaymentObj)
    // console.log($paypaldata, 'second')

    // added successfull payment data
    paypalPaymentObj.payerID = $paypaldata.payerID;
    paypalPaymentObj.paymentID = $paypaldata.paymentID;
    paypalPaymentObj.paymentToken = $paypaldata.paymentToken
    


    console.log(paypalPaymentObj)


    // paypal api call
    this.userService.sendPaypal(paypalPaymentObj)
    .subscribe(
      data => {
        console.log(data);
        if(data.status === "success"){
          // // store the success id
          // this.paypalSuccessId = data.subscription_id;

          location.href = '/'

          // // create paypal success url with success id
          // // this.paypalSuccessUrl = `${config.website_base_url}paypal-payment-success/${this.paypalSuccessId}`;
          // this.paypalPaymentUrl = `${config.api_base_url}user/paypal-success/${this.paypalSuccessId}/${this.cf}`;
          // go to paypal
          // setTimeout(()=>{
          //   $('#paypal_form').submit();
          // }, 2000);
        }
      },
      error => {
        console.log(error);
        alert('Something went wrong!');
      }
    )



  }



  /**
   * @func {{stripePayment}}
   * @description {{this will set the stripe payment form}}
   */
  stripePayment(){

    if($('#paypalformwrap #monthlyplan').prop('checked')){
      setTimeout(()=>{
            $('#stripeformwrap .form-inline').find('#monthlyplan').prop('checked', true)
      }, 100)
    }
    if($('#paypalformwrap #agmonthlyplan').prop('checked')){
      setTimeout(()=>{
            $('#stripeformwrap .form-inline').find('#agmonthlyplan').prop('checked', true)
      }, 100)
    }

    if($('#paypalformwrap #yarlyplan').prop('checked')){
      setTimeout(()=>{
            $('#stripeformwrap .form-inline').find('#yarlyplan').prop('checked', true)
      }, 100)
    }
    if($('#paypalformwrap #agyarlyplan').prop('checked')){
      setTimeout(()=>{
            $('#stripeformwrap .form-inline').find('#agyarlyplan').prop('checked', true)
      }, 100)
    }
    // state change
    if(this.stripePay == false){
      this.stripePay = true
    }


  }

  /**
   * @func {{paypalPayment}}
   * @description {{this will set the payment payment form}}
   */
  paypalPayment(){

    if($('#stripeformwrap #monthlyplan').prop('checked')){
      setTimeout(()=>{
            $('#paypalformwrap .form-inline').find('#monthlyplan').prop('checked', true)
      }, 100)
    }
    if($('#stripeformwrap  #agmonthlyplan').prop('checked')){
      setTimeout(()=>{
            $('#paypalformwrap .form-inline').find('#agmonthlyplan').prop('checked', true)
      }, 100)
    }

    if($('#stripeformwrap #yarlyplan').prop('checked')){
      setTimeout(()=>{
            $('#paypalformwrap .form-inline').find('#yarlyplan').prop('checked', true)
      }, 100)
    }
    if($('#stripeformwrap #agyarlyplan').prop('checked')){
      setTimeout(()=>{
            $('#paypalformwrap .form-inline').find('#agyarlyplan').prop('checked', true)
      }, 100)
    }
    // state change
    if(this.stripePay){
      this.stripePay = false
    }

    // call paypal express
    this.expressPaypal(this.planTotal)
    
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

    // call paypal express
    this.expressPaypal(this.planTotal)
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

    // call paypal express
    this.expressPaypal(this.planTotal)
  }


  // ***************************************
  // number of days subscribed current plan
  // ***************************************
  numberOfDaysBuy(dateSign, dateExpire){
    let currentPlanSignedDate = + new Date(moment(dateSign));
    let currentPlanExpiredDate = + new Date(moment(dateExpire));

    let currentDiffTimestamp = currentPlanExpiredDate - currentPlanSignedDate;
    let currentDiffDays = Math.ceil(currentDiffTimestamp / (1000 * 3600 * 24));
    
    return currentDiffDays;
  }


  // ****************************
  // how much day used the plan
  // ****************************
  howMuchUsedPlan(dateSign){
    // parse the time stamp
    let planSignedDate = + new Date(moment(dateSign));
    let currentDate = moment.now();

    // minus the current date to signed date for diffrence
    let diffTimestamp = currentDate - planSignedDate;
    let diffDays = Math.ceil(diffTimestamp / (1000 * 3600 * 24));
    
    return diffDays;
  }

  /**
   * @description {{second time monthly amount cut}}
   */
  scmonthlyDiscount($data){
    // console.log($data);
    // set plan total monthly
    this.planTotal = $data.amount_monthly;

    // monthly date assign
    this.planExpiryDate = moment().add(1, 'months').format();
    
    // number of days subscribed current plan
    let totalSubscriptionDays = this.numberOfDaysBuy(this.userInformation.user.subscription_plan.date_signed, this.userInformation.user.subscription_plan.expiration_date)
    console.log('total plan days', totalSubscriptionDays);

    // how much used the current plan
    let howMuchUsedPlan = this.howMuchUsedPlan(this.userInformation.user.subscription_plan.date_signed)
    console.log('used plan days', howMuchUsedPlan);

    // console.log(this.userInformation.user.subscription_plan.subscription_id)
    // as per current plan id filter from the all plan list
    let currentPlanId = this.userInformation.user.subscription_plan.subscription_id;
    let filteredPlan = this.planData.filter(plan => plan.id == currentPlanId);
    console.log(filteredPlan[0]);

    // calculate updated total
    let updatedPlanTotal = (filteredPlan[0].amount_monthly/totalSubscriptionDays)*howMuchUsedPlan;
    console.log(`current plan amount ${filteredPlan[0].amount_monthly} and total subscription day ${totalSubscriptionDays} and used day ${howMuchUsedPlan}`)
    // console.log(Math.floor(this.planTotal - updatedPlanTotal))


    console.log(this.planTotal, updatedPlanTotal)
    this.planTotal = Math.floor(this.planTotal - updatedPlanTotal);
    

    console.log(this.planExpiryDate)

    // invalid minus amount check
    if(this.planTotal < 0){
      this.invalidAmount = true;
    } else {
      this.invalidAmount = false;
    }

    // call paypal express
    this.expressPaypal(this.planTotal)
  }

  /**
   * @description {{second time yearly amount cut}}
   */
  scyearlyDiscount($data){
    // console.log($data)
    let totalYearlyPrice = $data.amount_monthly*12;
    // discount amount
    let totalDiscountPrice = totalYearlyPrice * ($data.yearly_discount/100);
    // assign plan data
    this.planTotal = totalYearlyPrice - totalDiscountPrice;
    // yearly date assign
    this.planExpiryDate = moment().add(1, 'years').format();


    // number of days subscribed current plan
    let totalSubscriptionDays = this.numberOfDaysBuy(this.userInformation.user.subscription_plan.date_signed, this.userInformation.user.subscription_plan.expiration_date)
    console.log('total plan days', totalSubscriptionDays);

    // how much used the current plan
    let howMuchUsedPlan = this.howMuchUsedPlan(this.userInformation.user.subscription_plan.date_signed)
    console.log('used plan days', howMuchUsedPlan);

    // console.log(this.userInformation.user.subscription_plan.subscription_id)
    // as per current plan id filter from the all plan list
    let currentPlanId = this.userInformation.user.subscription_plan.subscription_id;
    let filteredPlan = this.planData.filter(plan => plan.id == currentPlanId);
    console.log(filteredPlan[0]);

    // calculate updated total
    let updatedPlanTotal = (filteredPlan[0].amount_monthly/totalSubscriptionDays)*howMuchUsedPlan;
    console.log(Math.floor(this.planTotal - updatedPlanTotal))

    this.planTotal = Math.floor(this.planTotal - updatedPlanTotal);

    console.log(this.planExpiryDate)

    // invalid minus amount check
    if(this.planTotal < 0){
      this.invalidAmount = true;
    } else {
      this.invalidAmount = false;
    }

    // call paypal express
    this.expressPaypal(this.planTotal)
  }


  /**
   * @func {{upgradePlanPop}}
   * @param \{{{object}}\} {{$plan}} {{this is plan object}}
   * @param \{{{string}}\} {{cf}} {{current and future state change}}
   * @description {{this will open upgrade plan popup}}
   */
  upgradePlanPop($plan, cf){
    // set the stripePaymentData and cf state
    this.stripePaymentData = $plan;
    this.cf = cf;

    // open payment modal
    this.paymentPop = true;
    
    // discount check radio
    this.monthlyDiscount(this.stripePaymentData);


    // check the second time upgrade
    if(this.userInformation.user.subscription_plan.amount > 0){
      this.secondTimeBuyUpgrade = true;
    }

    // console.log(this.secondTimeBuyUpgrade);

    if(this.secondTimeBuyUpgrade){
      console.log('second', this.stripePaymentData)

      // updated total for the second time upgrade
      this.scmonthlyDiscount(this.stripePaymentData);
    }


    // invalid minus amount check
    if(this.planTotal < 0){
      this.invalidAmount = true;
    } else {
      this.invalidAmount = false;
    }
    
    // monthly radio check by default monthly
    // stripe plan checkbox default checked
    // stripe view load first time
    $('#monthlyplan').prop('checked', true);
    $('#stripe').prop('checked', true);
    this.stripePay = true;


    // console.log(this.stripePaymentData, this.cf)
  }


  /**
   * @func {{downgradePlanPop}}
   * @param \{{{object}}\} {{$plan}} {{this is plan object}}
   * @param \{{{string}}\} {{cf}} {{current and future state change}}
   * @description {{this will open downgrade plan popup}}
   */
  downgradePlanPop($plan, cf){
    // set the stripePaymentData and cf state
    this.stripePaymentData = $plan;
    this.cf = cf;

   
    // check the second time downgrade
    if($plan.amount_monthly < Math.floor(this.userInformation.user.subscription_plan.amount)){
      // default state
      this.secondTimeBuyUpgrade = false;
    }

    // open payment modal
    this.paymentPop = true;

    // discount check radio
    this.monthlyDiscount(this.stripePaymentData)


    // invalid minus amount check
    if(this.planTotal < 0){
      this.invalidAmount = true;
    } else {
      this.invalidAmount = false;
    }

    // monthly radio check by default monthly
    // stripe plan checkbox default checked
    // stripe view load first time
    $('#monthlyplan').prop('checked', true);
    $('#stripe').prop('checked', true);
    this.stripePay = true;


    // console.log(this.stripePaymentData, this.cf)
  }


  /**
   * @func {{getToken}}
   * @description {{this function will get the stripe payment token}}
   */
  getToken() {
    // console.log(this.stripePaymentData, this.cf)

    // processing status
    this.processingPayment = true;
    // stripe payment
    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.expiryMonth,
      exp_year: this.expiryYear,
      cvc: this.cvc
    }, (status: number, response: any) => {

      // Wrapping inside the Angular zone
      this._zone.run(() => {
        if (status === 200) {
          // console.log(response)

           // make the local payment object
           let subscriptionObj = {
            user_id:this.userInformation.user_id,
            stripeToken:response.id,
            amount: this.planTotal,
            paid_by:'S',
            payment_for:'Upgrade',
            id:this.userInformation.user.subscription_plan.id,
            org_id:this.userInformation.id,
            subscription_id:this.stripePaymentData.id,
            date_signed: this.currentDate,
            expiration_date: this.planExpiryDate,
            api_token:this.authUser.api_token,
            effect_on: this.cf
          }

          // checking for downgrade plan for the future plan
          if(this.cf == 'F'){
            subscriptionObj.date_signed = this.userInformation.user.subscription_plan.expiration_date;
            subscriptionObj.payment_for = 'Downgrade';
            // month checking for future plan
            if($('#monthlyplan').prop('checked')){
              // console.log('MM')
              subscriptionObj.expiration_date = moment(subscriptionObj.date_signed).add(1, 'month').format();
            }
            // year checking for future plan
            if($('#yarlyplan').prop('checked')){
              // console.log('YY')
              subscriptionObj.expiration_date = moment(subscriptionObj.date_signed).add(1, 'years').format();
            }

          }

          // console.log(subscriptionObj)
          // make the payment
          this.submitPayment(subscriptionObj);


        } else {
          console.log(response.error.message);
          // processing status
          this.processingPayment = false;
          // message error
          this.stripemsgs.push({severity:'error', detail:response.error.message});
          setTimeout(()=>{ this.stripemsgs = []; }, 5000);
        }
      });
    });

  }


  /**
   * @func {{serversend}}
   * @description {{this will make the paypal payment}}
   */
  // serversend(){
    
  //   // local object for paypal payment
  //   let paypalPaymentObj = {
  //     user_id: this.authUser.id,
  //     org_id: this.authUser.org_id,
  //     subscription_id: this.stripePaymentData.id,
  //     amount: this.planTotal,
  //     date_signed: this.currentDate,
  //     expiration_date: this.planExpiryDate,
  //     effect_on: this.cf
  //   }

  //   // checking for downgrade plan for the future plan
  //   if(this.cf == 'F'){
  //     paypalPaymentObj.date_signed = this.userInformation.user.subscription_plan.expiration_date;
  //     // month checking for future plan
  //     if($('#monthlyplan').prop('checked')){
  //       // console.log('MM')
  //       paypalPaymentObj.expiration_date = moment(paypalPaymentObj.date_signed).add(1, 'month').format();
  //     }
  //     // year checking for future plan
  //     if($('#yarlyplan').prop('checked')){
  //       // console.log('YY')
  //       paypalPaymentObj.expiration_date = moment(paypalPaymentObj.date_signed).add(1, 'years').format();
  //     }

  //   }

  //   // console.log(paypalPaymentObj)

  //   // paypal api call
  //   this.userService.sendPaypal(paypalPaymentObj)
  //     .subscribe(
  //       data => {
  //         console.log(data);
  //         if(data.status === "success"){
  //           // store the success id
  //           this.paypalSuccessId = data.subscription_id;

  //           // create paypal success url with success id
  //           // this.paypalSuccessUrl = `${config.website_base_url}paypal-payment-success/${this.paypalSuccessId}`;
  //           this.paypalPaymentUrl = `${config.api_base_url}user/paypal-success/${this.paypalSuccessId}/${this.cf}`;
  //           // go to paypal
  //           setTimeout(()=>{
  //             $('#paypal_form').submit();
  //           }, 2000);
  //         }
  //       },
  //       error => {
  //         console.log(error);
  //         alert('Something went wrong!');
  //       }
  //     )


  // }


// serversend(){
//   $('#paypal_form').submit();
// }



























  /**
   * @func {{submitPayment}}
   * @param \{{{object}}\} {{$paymentData}} {{send the total payment data with stripe successfully payment token}}
   * @description {{this function will send the payment object data with stripe id token}}
   */
  private submitPayment($paymentData){
    this.userService.postSubscribtion($paymentData)
      .subscribe(
        data => {
          // this will say thanks;
          // this.paymentthanks = true;
          // processing status
          this.processingPayment = false;

          // off the current modal and on the thanks modal
          this.paymentPop = false;
          this.thankyoupop = true;


          // reload the url
          setTimeout(()=>{ location.reload(); }, 2000);

          // get the all plan list again
          this.getAllSubscribtion(this.authUser.api_token, this.userLang.locale, this.authUser.org_id);

        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
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
          console.log(data);
          // data is assigned in the property
          this.planData = data.allSubscriptionsPlans;
          this.userInformation = data.user_information;
          // console.log(data.user_information.user.subscription_plan == null);

          if(data.user_information.user.subscription_plan == null){
            this.expirePlanDate = '';
          } else {
            this.expirePlanDate = moment(this.userInformation.user.subscription_plan.expiration_date).format("MMM Do YYYY");
            // plan expire date check
            // this.checkDateisGrater();
          }
          // this.expirePlanDate = moment(this.userInformation.user.subscription_plan.expiration_date).format("MMM Do YYYY");
          
          // remove loader progress
          $('.setting-http-load, .linear-progress').fadeOut()
          // console.log(this.planData, this.userInformation);
          // plan expire date check
          // this.checkDateisGrater();
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{ngOnInit}}
   * @description {{this is on init life cycle hook}}
   */
  ngOnInit() {
    // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();

    if (this.authUser.role_id === 2) {
      // alert('You have no permission for this url');
      this.router.navigate(['/user/settings/my-profile']);
    }

    // get the locale from the local storage
    this.userLang = JSON.parse(localStorage.getItem('lang'))

    // get the all plan list
    this.getAllSubscribtion(this.authUser.api_token, this.userLang.locale, this.authUser.org_id);


    // create paypal notify url
    this.paypalNotifyUrl = `${config.api_base_url}user/subscription-process`;
    // create paypal fail url
    this.paypalFailUrl = `${config.website_base_url}paypal-payment-fail`;
    // create paypal success url
    this.paypalSuccessUrl = `${config.website_base_url}paypal-payment-success`;

    this.paypalPaymentUrl = `${config.api_base_url}user/paypal-success`;

    

    $.getScript( 'https://www.paypalobjects.com/api/checkout.js', function() {

      paypal.Button.render({
        
          env: 'sandbox', // sandbox | production

          // PayPal Client IDs - replace with your own
          // Create a PayPal app: https://developer.paypal.com/developer/applications/create
          client: {
              sandbox:    'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
              production: '<insert production client id>'
          },

          // Show the buyer a 'Pay Now' button in the checkout flow
          commit: true,

          // payment() is called when the button is clicked
          payment: function(data, actions) {

              // Make a call to the REST api to create the payment
              return actions.payment.create({
                  payment: {
                      intent: "sale",
                      transactions: [
                          {
                              amount: { total: '', currency: 'USD' }
                          }
                      ],
                      redirect_urls: {
                        return_url: "https://remarsovr.com/paypal-payment-success",
                        cancel_url: "https://remarsovr.com/paypal-payment-fail"
                      }
                  }
              });
          },

          // onAuthorize() is called when the buyer approves the payment
          onAuthorize: function(data, actions) {

              // Make a call to the REST api to execute the payment
              return actions.payment.execute().then(function() {
                  window.alert('Payment Complete!');
                  console.log(data)
              });
          }

      }, '#paypal-button-container');
      

    });



    if( localStorage.getItem('authUser') != null ){
      setTimeout(() => {
        this.userService.getAuth(this.authUser.api_token)
          .subscribe(
            data => {

              // console.log(data.user);


              if (data.user.SubscriptionFeture != undefined) {
                const authdata = data.user;
                const subsFeature = data.user.SubscriptionFeture.map(f => f.feture_id * 1 );
                const cloneauthdata = { ...authdata, SubscriptionFeture: subsFeature };
  
                localStorage.setItem('authUser', JSON.stringify(cloneauthdata));
              } else {
                localStorage.setItem('authUser', JSON.stringify(data.user));
              }
            },
            error => {
              console.log(error);
            }
          );
      }, 1000);
    }


  }



}

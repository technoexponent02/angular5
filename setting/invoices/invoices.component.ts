import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../_services/user.service';
import {Message} from 'primeng/primeng';

import * as config from '../../../config';

// for jquery
declare var $: any;
declare var jQuery: any;
// for moment
declare var moment: any;

@Component({
  selector: 'invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  /**
   * @property \{{{Message[]}}\} {{msgs}} {{this will hold the all message data}}
   */
  msgs: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;
  /**
   * @property \{{{type}}\} {{invoiceData}} {{this will hold the all invoice data}}
   */
  invoiceData: any = [];
  /**
   * @property \{{{any}}\} {{currentPlanData}} {{this will be current plan data}}
   */
  currentPlanData: any = {}
  /**
   * @property \{{{boolean}}\} {{planDetails}} {{plan details pop up open close}}
   */
  planDetails: boolean = false;
  /**
   * @property \{{{any}}\} {{viewInvoice}} {{this will hold the view data}}
   */
  viewInvoice: any = [];
  /**
   * @property \{{{any}}\} {{calfrmDate}} {{this will take the date from filter data}}
   */
  calfrmDate: any = '';
  /**
   * @property \{{{any}}\} {{caltoDate}} {{this will take the date to filter data}}
   */
  caltoDate: any = '';
  /**
   * @property \{{{boolean}}\} {{notCountrySet}} {{this will view the country not select message}}
   */
  notCountrySet: boolean = true;
  // /**
  //  * @param \{{{boolean}}\} {{noInvoiceData}} {{this will check the has invoice data or not}}
  //  */
  // noInvoiceData: boolean = false;


  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private userService: UserService,
  ){}


  /**
   * @func {{planDetailsPop}}
   * @param \{{{object}}\} {{$data}} {{this will take the single plan data}}
   * @description {{this will open the plan details popup}}
   */
  planDetailsPop($data){
    // open the popup
    this.planDetails = true;
    // this will store the single view popup
    this.viewInvoice = $data;
  }

  /**
   * @func {{frmCall}}
   * @param \{{{string}}\} {{$data}} {{this will take the date as a string}}
   * @description {{this will make the service call as per from date}}
   */
  frmCall($data){
    // assign date in the property
    this.calfrmDate = $data;
    // check the value
    if($data == ''){
      this.caltoDate = '';
      jQuery('#todate').val('');
      // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
      // get all data as per filter date range
      this.getAllInvoiceData(this.authUser.api_token, this.authUser.id, this.calfrmDate, this.caltoDate);
    }
    // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
    // get all data as per filter date range
    this.getAllInvoiceData(this.authUser.api_token, this.authUser.id, this.calfrmDate, this.caltoDate);
  }

  /**
   * @func {{toCall}}
   * @param \{{{string}}\} {{$data}} {{this will take the date as a string}}
   * @description {{this will make the service call as per to date}}
   */
  toCall($data){
    // assign date in the property
    this.caltoDate = $data;
    // leser then checking
    let frmdate = + new Date(moment(this.calfrmDate).format());
    let todate = + new Date(moment(this.caltoDate).format()) 
    // console.log(frmdate < todate)
    if(frmdate < todate){
      // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
      // get all data as per filter date range
      this.getAllInvoiceData(this.authUser.api_token, this.authUser.id, this.calfrmDate, this.caltoDate);
    }
    else{
      if($data == ''){
        this.caltoDate = '';
        // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
        // get all data as per filter date range
        this.getAllInvoiceData(this.authUser.api_token, this.authUser.id, this.calfrmDate, this.caltoDate);
      }
      else{
        jQuery('#todate').val('');
        this.caltoDate = '';
        // console.log('fire ajax with - ', `${this.calfrmDate} - ${this.caltoDate}` );
        // get all data as per filter date range
        this.getAllInvoiceData(this.authUser.api_token, this.authUser.id, this.calfrmDate, this.caltoDate);
        // alert('To date must be grater then from date.')
        // warning message
        this.msgs = [];
        this.msgs.push({severity:'warn', summary:'Warning Message', detail:'To date must be grater than from date.'});
      }
    }
  }

  /**
   * @func {{getAllInvoiceData}}
   * @param \{{{sting}}\} {{$token}} {{this will take the auth user token}}
   * @param \{{{number}}\} {{$userId}} {{this will take the auth user id}}
   * @param \{{{date}}\} {{$dateFrom}} {{this will take the from date}}
   * @param \{{{date}}\} {{$dateTo}} {{this will take the to date}}
   */
  private getAllInvoiceData($token, $userId, $dateFrom, $dateTo){
    this.userService.getInvoiceData($token, $userId, $dateFrom, $dateTo)
      .subscribe(
        data => {
          if(data.status === "success"){
            // take the full data in the local object
            let invoice = data.subscriptions;
            console.log(data);
            // check the subscription details null
            // if(invoice.subscription_details == null){
            //   this.notCountrySet = true;
            // } else {
              // create the new object
              this.invoiceData = invoice.map(invoice => (
                { 
                  id: invoice.id,
                  invoice_link: invoice.invoice_link,
                  user_id: invoice.user_id,
                  org_id: invoice.org_id,
                  amount: invoice.amount,
                  date_signed: moment(invoice.date_signed).format('DD-MM-YYYY'),
                  expiration_date: moment(invoice.expiration_date).format('DD-MM-YYYY'),
                  subscription_status: invoice.subscription_status,
                  amount_monthly: invoice.subscription_details.amount_monthly,
                  yearly_discount: invoice.subscription_details.yearly_discount,
                  maximum_tour: invoice.subscription_details.maximum_tour,
                  maximum_users: invoice.subscription_details.maximum_users,
                  sences_per_tour: invoice.subscription_details.sences_per_tour,
                  name: invoice.subscription_details.name,
                  subscription_method: invoice.subscription_method,
                  note: invoice.subscription_details.note,
                  link: config.api_base_url+'invoicePdf?api_token='+this.authUser.api_token+'&'+invoice.invoice_link
                }
              ));
              // filter the current data plan
              this.invoiceData.filter(
                invoice => {
                  if(invoice.subscription_status == 'C'){
                    this.currentPlanData = invoice;
                  }
                }
              );
            // }
            
            // no invoice data
            // console.log(invoice.length);
            // if(invoice.length == 0){
            //   this.noInvoiceData = true;
            // } else {
            //   this.noInvoiceData = false;
            // }
            // remove loader progress
            $('.setting-http-load, .linear-progress').fadeOut()
          }
          if(data.status === "fail"){
            alert('You are not a valid user!');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{ngOnInit}}
   * @description {{this is angular life cycle hook}}
   */
  ngOnInit() {
    // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();

    // get all service call
    this.getAllInvoiceData(this.authUser.api_token, this.authUser.id, this.calfrmDate, this.caltoDate);

    // jquery datepicker integrated
    // get the angular this scope for the jquery function scope
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

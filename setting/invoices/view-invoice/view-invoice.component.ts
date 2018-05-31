import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../../../_services/user.service';

import * as config from '../../../../config';

// for jquery
declare var $: any;

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css']
})
export class ViewInvoiceComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{id}} {{this is where we store diffrent user token}}
   */
  id: any;
  /**
   * @property \{{{any}}\} {{queryObj}} {{this will get the query data from the url}}
   */
  queryObj:any;
  /**
   * @property \{{{any}}\} {{invoiceData}} {{store the invoice data}}
   */
  invoiceData: any = [];
  /**
   * @property \{{{any}}\} {{apiLink}} {{this will set the api link}}
   */
  apiLink: any = '';



  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  /**
   * @func {{getViewIn}}
   * @param \{{{any}}\} {{$id}} {{pass the invoice id}}
   * @param \{{{any}}\} {{$token}} {{this will take the auth token}}
   * @description {{this method will fetch the invoice data}}
   */
  getViewIn($id, $token){
    this.userService.getViewInvoiceData($id, $token)
      .subscribe(
        data => {
          // console.log(data)
          if(data.status == "success"){
            this.invoiceData = data.Subscription;
            // console.log(this.invoiceData)
          }
          if(data.status == "error"){
            $('body').css('overflow', 'hidden');
            $('body').append('<div id="noperoverly"><div class="middle"><h3>You have no permission to view this Invoice</h3></div></div>')
          }
          if(data.status == "fail"){
            alert('something is wrong!')
          }
        },
        error => {
          console.log(error);
          alert('something went wrong!')
        }
      );
  }



  /**
   * @func {{ngOnInit}}
   * @description {{this is angular lifecycle hook}}
   */
  ngOnInit() {
    // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();

    // apiurl set
    this.apiLink = config.api_base_url;

    // get the data from the query param
    this.route.queryParamMap.subscribe(params => {
      // store the param data in the this local query obj
      this.queryObj = {...params.keys, ...params};

      // set the id
      this.id = this.queryObj.params.id;
      // console.log(this.id);

      // fetch the invoice data
      if(this.authUser == null){
        $('body').css('overflow', 'hidden');
        $('body').append('<div id="noperoverly"><div class="middle"><h3>You have no permission to view this Invoice</h3></div></div>')
      } else {
        this.getViewIn(this.id, this.authUser.api_token);
      }

    });

  }

}

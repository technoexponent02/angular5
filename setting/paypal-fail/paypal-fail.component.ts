import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../_services/user.service';

@Component({
  selector: 'app-paypal-fail',
  templateUrl: './paypal-fail.component.html',
  styleUrls: ['./paypal-fail.component.css']
})
export class PaypalFailComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;

  
  constructor(
    private userService: UserService,
  ) {}


  ngOnInit() {
    // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../_services/user.service';
import {AdminService} from '../../_services/admin.service';
import * as config from '../../config';

@Component({
  selector: 'app-organization-financial',
  templateUrl: './organization-financial.component.html',
  styleUrls: ['./organization-financial.component.css']
})
export class OrganizationFinancialComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{authUser}} {{store the auth user data form the localstorage}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{lang}} {{here set the lang values}}
   */
  lang: any;
  /**
   * @property \{{{any}}\} {{orgDetails}} {{this will store the organaization details}}
   */
  orgDetails: any = [];
  /**
   * @property \{{{any}}\} {{countryList}} {{store the country list data}}
   */
  countryList: any = [];
  /**
   * @property \{{{any}}\} {{industryList}} {{store the industry list data}}
   */
  industryList: any = [];
  /**
   * @property \{{{any}}\} {{imglink}} {{here store the base public img url}}
   */
  imglink: any = '';



  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private adminService: AdminService
  ) {}


  /**
   * @func {{getOrgData}}
   * @param \{{{string}}\} {{$token}} {{authuser token}}
   * @param \{{{string}}\} {{$locale}} {{pass the locale value}}
   * @param \{{{number}}\} {{$orgId}} {{pass the organization id}}
   */
  getOrgData($token, $locale, $orgId){
    this.userService.getOrganization($token, $locale, $orgId)
      .subscribe(
        data => {
          // console.log(data);
          // assign country list
          this.countryList = data.country;
          // assign industry list
          this.industryList = data.industry;
        },
        error => {
          console.log(error);
        }
      )
  }
  


  /**
   * @func {{ngOnInit}}
   * @description {{this is angular lifecycle hook}}
   */
  ngOnInit() {
    // set the auth user and store the data in the localstorage
    this.authUser = this.userService.getAuthUser();

    // set the lang from local storage
    this.lang = JSON.parse(localStorage.getItem('lang'));

    // set public img
    this.imglink = config.public_img;

    // woring in the route param
    this.route.params.subscribe(params => {
      // check proper session storage for the organization details
      let orgData = JSON.parse(sessionStorage.getItem('orgData'));
      // console.log(orgData);
      // check has seccion value
      if(sessionStorage.getItem('orgData') == null){
        // alert message and redirect
        alert('Something messed up');
        this.router.navigate(['/admin/financial']);
      } else {
        // check seccion data and route param id is correct 
        if(params.id == orgData.id){
          // assign organization details data
          this.orgDetails = orgData;


          // fetch org data
          this.getOrgData(this.authUser.api_token, this.lang.locale, this.orgDetails.id);

        } else {
          // alert message and redirect
          alert('Something messed up');
          this.router.navigate(['/admin/financial']);
        }
      }

    });

  }

}

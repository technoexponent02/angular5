import { Component, OnInit } from '@angular/core';

import {UserService} from '../../../_services/user.service';
import {AdminService} from '../../../_services/admin.service';

import {Message} from 'primeng/primeng'

// for jquery
declare var $: any;

@Component({
  selector: 'api-and-integration',
  templateUrl: './api-and-integration.component.html',
  styleUrls: ['./api-and-integration.component.css']
})
export class ApiAndIntegrationComponent implements OnInit {
  /**
   * @property \{{{Message}}\} {{msgs}} {{this will hold the message data}}
   */
  msgs: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{store the auth user data from the localstorage}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{lang}} {{store the lang value from localstorage lang obj}}
   */
  lang: any;
  /**
   * @property \{{{any}}\} {{apilist}} {{this will list all the api list}}
   */
  apilist: any;
  /**
   * @property \{{{any}}\} {{setApi}} {{set the init value}
   */
  setApi: any = {
    api_token: '',
    token: '',
    api_key: '',
    domain: null
  };
  /**
   * @property \{{{any}}\} {{editApiDomain}} {{this will store the edit api key and domain value}}
   */
  editApiDomain: any = {
    domain: '',
    did: '',
    api_key: ''
  };
  noAccess: any = false;


  /**
   * @constructor
   * @description {{DI will pushed hre}}
   */
  constructor(
    private userService: UserService,
    private adminService: AdminService
  ) { }


  /**
   * @function {{editChange}}
   * @param \{{{any}}\} {{$data}} {{this pass the select box option value}}
   */
  editChange($data) {
    // filter the single data
    const singledata = this.apilist.find((obj) => {
      return obj.domain_name === $data;
    });
    // set the api domain key
    this.editApiDomain.api_key = singledata.api_key;
    this.editApiDomain.did = singledata.id;
  }


  /**
   * @func {{dltApi}}
   * @description {{this will delete the api}}
   */
  dltApi($data) {
    // alert(JSON.stringify($data));

    const localobj = {
      api_token: this.authUser.api_token,
      id: $data.id
    };

    if (confirm('You want to delete?')) {
      this.userService.dltApiCred(localobj)
          .subscribe(
            data => {
              this.msgs = [];
              this.msgs.push({severity: 'error', summary: 'Delete', detail: 'Deleted successfully'});
              // console.log(data);
              // get all api list
              this.getAllApiList();
            },
            err => {
              console.log(err);
              alert('Something went wrong when deleting');
            }
          );
      }
    }

    



  /**
   * @func {{updateApi}}
   * @description {{this function will update the api key manually}}
   */
  updateApi() {
    // make the local object
    const makelocalobj = {
      api_token: this.authUser.api_token,
      api_key: this.editApiDomain.api_key,
      did: this.editApiDomain.did
    };

    // console.log(makelocalobj);

    // service call
    this.userService.activeInavtive(makelocalobj)
      .subscribe(
        data => {
          // console.log(data);
          if(data.response.status == 1){
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: 'Success Message', detail: data.response.message});

            // get all api list
            this.getAllApiList();

            // set api call
            this.setApiCall();
          }
          if(data.response.status == 0){
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: data.response.message});
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }




  


  /**
   * @function {{getAllApiList}}
   * @description {{this will get all the generated api list}}
   */
  getAllApiList() {
    this.userService.apiIntList({api_token: this.authUser.api_token})
      .subscribe(
        data => {
          // open loader
          $('.setting-http-load, .linear-progress').fadeOut();
          // response chk
          if(data.response.status == 1){
            this.apilist = data.response.api;


            // make first domain and api key selected
            // console.log(data.response.api == undefined)
            if(data.response.api == undefined){
              // nothing to do
            }else{
              this.editApiDomain.api_key = data.response.api[0].api_key;
              this.editApiDomain.domain = data.response.api[0].domain_name;
              this.editApiDomain.did = data.response.api[0].id;
            }
            // console.log(this.editApiDomain)
            
          }
          if(data.response.status == 0){
            this.msgs = [];
            this.msgs.push({severity:'errror', summary:'Error Message', detail:data.response.message});
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!')
        }
      );
  }

  /**
   * @function {{setApiCall}}
   * @description {{this will set the api first time}}
   */
  setApiCall() {
    this.userService.setApi({api_token: this.authUser.api_token})
      .subscribe(
        data => {
          if(data.response.status == 1){
            this.setApi.token = data.response.api_token;
            this.setApi.api_key = data.response.api_key;


          }
          if(data.response.status == 0){
            this.msgs = [];
            this.msgs.push({severity:'errror', summary:'Error Message', detail:data.response.message});
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong');
        }
      );
  }

  /**
   * @function {{addApi}}
   * @description {{add the api}}
   */
  addApi() {
    // console.log(this.setApi);

    this.userService.addApi(this.setApi)
      .subscribe(
        data => {
          if (data.response.status == 1) {
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: 'Success Message', detail: data.response.message});

            setTimeout(() => {
              location.reload();
            }, 1000);
          }
          if (data.response.status == 0) {
            this.msgs = [];
            this.msgs.push({severity: 'errror', summary: 'Error Message', detail: data.response.message});
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong');
        }
      );
  }


  /**
   * @function {{statusUpdate}}
   * @description {{status update api}}
   */
  statusUpdate($data){
    // console.log($data)

    var localdata;
    // console.log($data.status == 0)
    // make local data
    if ($data.status == 1) {
      localdata = {
        api_token: this.authUser.api_token,
        did: $data.id,
        api_key: $data.api_key,
        status: 0
      };
    };
    if ($data.status == 0) {
      localdata = {
        api_token: this.authUser.api_token,
        did: $data.id,
        api_key: $data.api_key,
        status: 1
      };
    }

    // console.log(localdata)

    // service call
    this.userService.activeInavtive(localdata)
      .subscribe(
        data => {
          // console.log(data);
          if(data.response.status == 1){
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: 'Success Message', detail: data.response.message});

            // get all api list
            this.getAllApiList();

            // set api call
            this.setApiCall();
          }
          if(data.response.status == 0){
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: data.response.message});
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
   * @description {{angular lifecycle hook}}
   */
  ngOnInit() {
    // get the lang data from localstorage
    this.lang = JSON.parse(localStorage.getItem('lang'));
    // set the auth user and store the data in the localstorage
    this.authUser = this.userService.getAuthUser();

    if (this.authUser.SubscriptionFeture.includes(6) != true) {
      this.noAccess = true;
    }



    // set the api token value
    this.setApi.api_token = this.authUser.api_token;

    // get all api list
    this.getAllApiList();

    // set api call
    this.setApiCall();

  }

}

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../_services/admin.service';
import {UserService} from '../../../_services/user.service';
import * as config from '../../../config';

import {PaginationInstance} from 'ngx-pagination';
import {Message} from 'primeng/primeng';


declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-api-integration',
  templateUrl: './api-integration.component.html',
  styleUrls: ['./api-integration.component.css']
})
export class ApiIntegrationComponent implements OnInit {
  /**
   * @property \{{{Message}}\} {{msgs}} {{this will hold the message data}}
   */
  msgs: Message[] = [];

  authUser: any = [];
  allOrgData: any [];

  apiResults: any = [];

  singleOrg: any = '';

  constructor(
    private adminService: AdminService,
    private userService: UserService
  ) { }


  selectOrg($data) {
    this.getAllApi(this.authUser.api_token, $data);
  }


  getAllApi(token, orgid) {
    this.adminService.getAllApiAdmin(token, orgid)
      .subscribe(
        (adata: any) => {
          console.log(adata);
          this.apiResults = adata.data;
        },
        err => {
          console.log(err);
          alert('Something went wrong!');
        }
      );
  }



  /**
   * @func {{getAllOrganaization}}
   * @description {{this will fetch all the org}}
   */
  getAllOrganaization($lang) {
    this.adminService.getAllOrgData($lang)
      .subscribe(
        data => {
          this.allOrgData = data;
        },
        err => {
          console.log(err);
          alert('Something went wrong!');
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
        // token: $data.api_token,
        api_key: $data.api_key,
        status: 0
      };
    }
    if ($data.status == 0) {
      localdata = {
        // token: $data.api_token,
        api_key: $data.api_key,
        status: 1
      };
    }

    // // console.log(localdata)

    // // service call
    this.userService.activeInavtiveAdmin(localdata, this.authUser.api_token)
      .subscribe(
        data => {
          // console.log(data);
          if(data.response.status == 1){
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: 'Success Message', detail: data.response.message});

            this.getAllApi(this.authUser.api_token, this.singleOrg);
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







  ngOnInit() {
    // get all org
    this.getAllOrganaization('en');

    this.authUser = this.userService.getAuthUser();


    this.getAllApi(this.authUser.api_token, '');

  }

}

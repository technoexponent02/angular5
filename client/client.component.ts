import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{clientToken}} {{this store the client token form session storage}}
   */
  clientToken: any;
  /**
   * @property \{{{any}}\} {{clientOrgId}} {{this store the client org id form session storage}}
   */
  clientOrgId: any;
  /**
   * @property \{{{any}}\} {{clientType}} {{this store the clientType form session storage}}
   */
  clientType: any;
  /**
   * @property \{{{any}}\} {{orgName}} {{this store the orgName form session storage}}
   */
  orgName: any;
  /**
   * @property \{{{any}}\} {{client}} {{this object store the 'clientToken' data}}
   */
  client: any = {
    client_token: '',
    org_id: '',
    type: ''
  };
  /**
   * @property \{{{boolean}}\} {{chkOwner}} {{this will chek the type of user is owner}}
   */
  chkOwner: boolean = false;
  /**
   * @property \{{{boolean}}\} {{chkManager}} {{this will chek the type of user is manager}}
   */
  chkManager: boolean = false;
  /**
   * @property \{{{boolean}}\} {{chkEditor}} {{this will chek the type of user is editor}}
   */
  chkEditor: boolean = false;
  /**
   * @property \{{{boolean}}\} {{chkAdminManager}} {{this will chek the type of admin is manager}}
   */
  chkAdminManager: boolean = false;
  /**
   * @property \{{{boolean}}\} {{chkAdminExe}} {{this will chek the type of admin is executive}}
   */
  chkAdminExe: boolean = false;


  /**
   * @constructor
   * @description {{DI is pushed in this component constractor class}}
   */
  constructor(
    private router: Router
  ) {}

  /**
   * @func {{fineUrl}}
   * @param \{{{string}}\} {{url}} {{pass the url with query string}}
   * @description {{this method will give you fine url without query string}}
   */
  private fineUrl(url){
    return url.split("?")[0];
  }


  /**
   * @func {{chkAdminManagerMth}}
   * @description {{this will check user is admin manager or not}}
   */
  private chkAdminManagerMth(){
    if(this.client.type == 4 && this.client.org_id == 0){
    // if(this.client.org_id == 0){
      // make check owner false
      // this.chkOwner = false;
      // make check manager true
      this.chkAdminManager = true;
      // store route 
      // let chkUrl = this.router.url;
      // // unauthorized route for manager
      // if(this.fineUrl(chkUrl) == '/admin/client/subscription' || this.fineUrl(chkUrl) == '/admin/client/invoices'){
      //   alert('You have no permission for this url');
      //   this.router.navigate(['admin/clients']);
      // }
    }
  }

  /**
   * @func {{chkAdminExeMth}}
   * @description {{this will check user is admin manager or not}}
   */
  private chkAdminExeMth(){
    if(this.client.type == 5 && this.client.org_id == 0){
    // if(this.client.org_id == 0){
      // make check owner false
      // this.chkOwner = false;
      // make check manager true
      this.chkAdminExe = true;
      // store route 
      // let chkUrl = this.router.url;
      // // unauthorized route for manager
      // if(this.fineUrl(chkUrl) == '/admin/client/subscription' || this.fineUrl(chkUrl) == '/admin/client/invoices'){
      //   alert('You have no permission for this url');
      //   this.router.navigate(['admin/clients']);
      // }
    }
  }

  /**
   * @func {{chkUserOwner}}
   * @description {{this will check user is owner or not}}
   */
  private chkUserOwner(){
    if(this.client.type == 1 && this.client.org_id > 0){
      this.chkOwner = true;
    }
  }

  /**
   * @func {{chkUserManager}}
   * @description {{this will check user is user manager or not}}
   */
  private chkUserManager(){
    if(this.client.type == 4 && this.client.org_id > 0){
      // make check owner false
      this.chkOwner = false;
      // make check manager true
      this.chkManager = true;
      // store route 
      let chkUrl = this.router.url;
      // unauthorized route for manager
      if(this.fineUrl(chkUrl) == '/admin/client/subscription' || this.fineUrl(chkUrl) == '/admin/client/invoices'){
        alert('You have no permission for this url');
        this.router.navigate(['admin/clients']);
      }
    }
  }

  /**
   * @func {{chkUserEditor}}
   * @description {{this will check user is user editor or not}}
   */
  private chkUserEditor(){
    if(this.client.type == 5 && this.client.org_id > 0){
      // make check owner false
      this.chkOwner = false;
      // make check manager false
      this.chkManager = false;
      // make check editor true
      this.chkEditor = true;
      // store route 
      let chkUrl = this.router.url;
      // unauthorized route for editor
      if(this.fineUrl(chkUrl) == '/admin/client/subscription' || this.fineUrl(chkUrl) == '/admin/client/invoices' || this.fineUrl(chkUrl) == '/admin/client/organization' || this.fineUrl(chkUrl) == '/admin/client/configuration' || this.fineUrl(chkUrl) == '/admin/client/branding' || this.fineUrl(chkUrl) == '/admin/client/users' || this.fineUrl(chkUrl) == '/admin/client/api-and-integration'){
        alert('You have no permission for this url');
        this.router.navigate(['admin/clients']);
      }
    }
  }


  /**
   * @func {{ngOnInit}}
   * @description {{this is life cycle hook}}
   */
  ngOnInit() {
    // get the "clientToken", "orgId" and "clientType" value form sessionStorage
    this.clientToken = sessionStorage.getItem('adminViewClient');
    this.clientOrgId = sessionStorage.getItem('adminViewClientOrg');
    this.clientType = sessionStorage.getItem('adminViewClientType');
    this.orgName = sessionStorage.getItem('orgName');
    // set the session storage value in the client object 'client_token'
    this.client.client_token = this.clientToken;
    // set the session storage value in the client object 'org_id'
    this.client.org_id = this.clientOrgId;
    // set the session storage value in the client object 'type'
    this.client.type = this.clientType;

    console.log(this.client, this.router.url);

    // user owner check method
    this.chkUserOwner();

    // user manager check method
    this.chkUserManager();

    // user editor check method
    this.chkUserEditor();

    // check admin manager
    this.chkAdminManagerMth();

    // check admin executive
    this.chkAdminExeMth();

  }

}

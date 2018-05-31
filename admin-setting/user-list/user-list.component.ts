import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../_services/user.service';
import {AdminService} from '../../../_services/admin.service';

import {Message} from 'primeng/primeng'

// for jquery
declare var $: any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  /**
   * @property \{{{Message}}\} {{msgs}} {{this will hold the message data}}
   */
  msgs: Message[] = [];
  /**
   * @property \{{{Message}}\} {{errmsgs}} {{this will hold the error message data}}
   */
  errmsgs: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{store the auth user data from the localstorage}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{lang}} {{store the lang value from localstorage lang obj}}
   */
  lang: any;
  /**
   * @property \{{{any}}\} {{userList}} {{all user list store in here}}
   */
  userList: any = []
  /**
   * @property \{{{boolean}}\} {{inviteUser}} {{this will show and hide the invite user pop up}}
   */
  inviteUser: boolean = false;
  /**
   * @property \{{{boolean}}\} {{userRole}} {{this will open up the popup for user role}}
   */
  userRole: boolean = false;
  /**
   * @property \{{{any}}\} {{inviteUserObj}} {{This will hold the user invite data}}
   */
  inviteUserObj: any = {
    first_name: '',
    last_name: '',
    api_token: '',
    email: '',
    role_id: 1,
    org_id: ''
  };
  /**
   * @property \{{{any}}\} {{inviteUserRole}} {{store the invite user role}}
   */
  inviteUserRole: any = [];
  /**
   * @property \{{{any}}\} {{roleChangeUser}} {{hold the role change data}}
   */
  roleChangeUser: any = ''


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
   * @func {{inviteUserPop}}
   * @description {{on click invite user button this method will call for show and hide pop up}}
   */
  inviteUserPop(){
    this.inviteUser = true;
  }

  /**
   * @todo delete method need to be done
   */
  private deleteUser($eventData){
    alert($eventData);
  }

  /**
   * @func {{getAllUsers}}
   * @param \{{{string}}\} {{$token}} {{set this param value from the suthenticated user token}}
   * @param \{{{string}}\} {{$locale}} {{set this param value from the lang locale value}}
   * @description {{this method will call all user list data from the server by the service call }}
   */
  private getAllUsers($token, $locale){
    this.adminService.adminGetAllUserList($token, $locale)
      .subscribe(
        data => {
          $('.setting-http-load, .linear-progress').fadeOut();
          if(data.status === "success"){
            this.userList = data.users;
          }
          if(status === "fail"){
            alert('You are not an admin');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong');
        }
      );
  }


  /**
   * @func {{getAllInviteUserData}}
   * @param \{{{sting}}\} {{$token}} {{this param will take the auth user token}}
   * @param \{{{string}}\} {{$lang}} {{this param will take the lang locale value}}
   * @description {{this method will get the all initial invited user data like roles}}
   */
  private getAllInviteUserData($token, $lang){
    this.adminService.userInvitedData($token, $lang)
      .subscribe(
        data => {
          if(data.status === "success"){
            this.inviteUserRole = data.roles;
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{inviteUserPost}}
   * @description {{this method will post the invided user data obj}}
   */
  inviteUserPost(){
    this.adminService.inviteUser(this.inviteUserObj)
      .subscribe(
        data => {
          if(data.status === "success"){
            // alert(data.message)
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Success Message', detail:data.message});
            // pop up state changes. open to close
            this.inviteUser = false;
            // object state changes to blank
            this.inviteUserObj = {
              first_name: '',
              last_name: '',
              api_token: this.authUser.api_token,
              email: '',
              role_id: 1,
              org_id: ''
            };
          }
          if(data.status === "fail"){
            // console.log(data);
            // store error messages object
            let errorMsgObj = data.errors;
            // clear the message box first
            this.errmsgs = [];
            // console.log(data);
            // push the error message according validation error 
            if(errorMsgObj.email){
              this.errmsgs.push({severity:'error', summary:'Email error', detail:errorMsgObj.email});
            }
            if(errorMsgObj.first_name){
              this.errmsgs.push({severity:'error', summary:'First name error', detail:errorMsgObj.first_name});
            }
            if(errorMsgObj.last_name){
              this.errmsgs.push({severity:'error', summary:'Last name error', detail:errorMsgObj.last_name});
            }
          }
          if(data.status === "fail2"){
            this.errmsgs = [];
            this.errmsgs.push({severity:'error', summary:'Existing user', detail:data.err});
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!')
        }
      );
  }


  /**
   * @func {{editRole}}
   * @param \{{{object}}\} {{$data}} {{this will edit the role}}
   */
  editRole($data){
    // user role popup open
    this.userRole = true;
    // hold cinge user for role change user data
    this.roleChangeUser = $data;
    // console.log($data);
  }

  /**
   * @func {{roleChange}}
   * @description {{this will change the roleof the single user}}
   */
  roleChange(){
    // create local object for sending via service
    let roleChangeObj = {
      user_id:this.roleChangeUser.id,
      role_id:this.inviteUserObj.role_id,
      api_token: this.authUser.api_token
    }

    // console.log(roleChangeObj);
    // service call for change role
    this.userService.userChangeRole(roleChangeObj)
      .subscribe(
        data => {
          if(data.status === "success"){
            // user role popup close
            this.userRole = false;
            // message
            this.msgs = [];
            this.msgs.push({severity:'success', summary:'Success', detail:'Role Successfully changed.'});
            // this will fetch all user list data
            this.getAllUsers(this.authUser.api_token, this.lang.locale);
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!')
        }
      );
  }


  /**
   * @func {{ngOnInit}}
   * @description {{This is on init lifecycle hook}}
   */
  ngOnInit() {
    // get the lang data from localstorage
    this.lang = JSON.parse(localStorage.getItem('lang'));    
    // set the auth user and store the data in the localstorage
    this.authUser = this.userService.getAuthUser();
    //set the api token in the invite userobj api token
    this.inviteUserObj.api_token = this.authUser.api_token;
    // set the og id from the authuser data
    this.inviteUserObj.org_id = this.authUser.org_id;
    // this will fetch all user list data
    this.getAllUsers(this.authUser.api_token, this.lang.locale);
    
    // get the all invite user details 
    this.getAllInviteUserData(this.authUser.api_token, this.lang.locale);

  }

}

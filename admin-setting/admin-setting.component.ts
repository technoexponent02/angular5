import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../_services/user.service';

@Component({
  selector: 'app-admin-setting',
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.component.css']
})

/**
 * @class \{{{class}}\} {{AdminSettingComponent}}
 * @description {{this is AdminSettingComponent class}}
 */
export class AdminSettingComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;
  /**
   * @property \{{{boolean}}\} {{chkSuperAdmin}} {{this will check the type of user super admin from localstorage}}
   */
  chkSuperAdmin: boolean = true;
  /**
   * @property \{{{boolean}}\} {{chkManager}} {{this will check the type of user is admin manager from the local storage}}
   */
  chkAdminManager: boolean = false;
  /**
   * @property \{{{boolean}}\} {{chkEditor}} {{this will check the type of user is admin editor from the local storage}}
   */
  chkAdminEditor: boolean = false;

  /**
   * @constructor \{{{constructor}}\}
   * @description {{DI will be pushed here}}
   */
  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  /**
   * @func {{managerChk}}
   * @description {{this method will check the manager and validate route as per checking}}
   */
  private managerChk(){
    if(this.authUser.type == 4){
      // change the manager state
      this.chkAdminManager = true;
      // not superadmin
      this.chkSuperAdmin = false;
      // unauthorized route for manager
      if(this.router.url == '/admin/settings/subscription-plan'){
        console.log('You have no permission for this url');
        this.router.navigate(['admin/settings/localization']);
      }
    }
  }

  /**
   * @func {{editorChk}}
   * @description {{this method will check the editor and validate route as per checking}}
   */
  private editorChk(){
    if(this.authUser.type == 5){
      // change the editor state
      this.chkAdminEditor = true;
      // not an owner
      this.chkSuperAdmin = false;
      // navigate to my profile
      this.router.navigate(['admin/settings/my-profile']);
      // unauthorized route for editor
      if(this.router.url == '/admin/settings/localization' || this.router.url == '/admin/settings/organization' || this.router.url == '/admin/settings/subscription-plan' || this.router.url == '/admin/settings/users' || this.router.url == '/admin/settings/api-and-integration' || this.router.url == '/admin/settings/clients-in-settings'){
        console.log('You have no permission for this url');
        this.router.navigate(['admin/settings/my-profile']);
      }
    }
  }


  /**
   * @func {{ngOnInit}}{{This is a life cycle hook}}
   */
  ngOnInit() {
    // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();

    // check if is manager
    this.managerChk();
    
    // check if is editor
    this.editorChk();
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../_services/user.service';


@Component({
  selector: 'user-setting',
  templateUrl: './setting.component.html'
})

/**
 * @class \{{{class}}\} {{SettingComponent}}
 * @description {{description}}{{ this is my SettingComponent class}}
 */
export class SettingComponent implements OnInit{
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;
  /**
   * @property \{{{boolean}}\} {{chkManager}} {{this will chek the type of user is manager from auth user in the local storage}}
   */
  chkOwner: boolean = true;
  /**
   * @property \{{{boolean}}\} {{chkManager}} {{this will chek the type of user is manager from auth user in the local storage}}
   */
  chkManager: boolean = false;
  /**
   * @property \{{{boolean}}\} {{chkEditor}} {{this will chek the type of user is editor from auth user in the local storage}}
   */
  chkEditor: boolean = false;


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
      this.chkManager = true;
      // not an owner
      this.chkOwner = false;
      // unauthorized route for manager
      if(this.router.url == '/user/settings/subscription' || this.router.url == '/user/settings/invoices'){
        alert('You have no permission for this url');
        this.router.navigate(['user/settings/my-profile']);
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
      this.chkEditor = true;
      // not an owner
      this.chkOwner = false;
      // unauthorized route for editor
      if(this.router.url == '/user/settings/subscription' || this.router.url == '/user/settings/invoices' || this.router.url == '/user/settings/organization' || this.router.url == '/user/settings/configuration' || this.router.url == '/user/settings/branding' || this.router.url == '/user/settings/users' || this.router.url == '/user/settings/api-and-integration'){
        alert('You have no permission for this url');
        this.router.navigate(['user/settings/my-profile']);
      }
    }
  }




   /**
   * @func {{ngOnInit}}{{This is a life cycle hook}}
   */
  ngOnInit():void {
    // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();

    // check if is manager
    this.managerChk();

    // check if is editor
    this.editorChk();

    


  }



}

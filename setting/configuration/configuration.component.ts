import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../_services/user.service';
import { LanguageService } from '../../../_services/language/language.service'

import {Message} from 'primeng/primeng';

// for jquery
declare var $: any;

@Component({
  selector: 'configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  /**
   * @property \{{{Message[]}}\} {{msg}} {{store the message data}}
   */
  msgs: Message[] = [];
  /**
   * @property \{{{Message[]}}\} {{btmmsgs}} {{store the form messages data}}
   */
  btmmsgs: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{this holds the authenticate user details}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{userLanguage}} {{this holds the user language selected value}}
   */
  userLanguage: any = {};
  /**
   * @property \{{{any}}\} {{configurationDetails}} {{this holds the authenticated user configuration all data}}
   */
  configurationDetails:any = [];
 /**
   * @property \{{{any}}\} {{configObj}} {{this holds the authenticated user only configuration data}}
   */
  configObj:any={
    "id": '',
    "user_id": '',
    "dashboard_language_id": "1",
    "control": "0",
    "scene_selector": "0",
    "audio": "0",
    "location": "0",
    "share": "0",
    "logo": "0",
    "organization": "0",
    "share_option_id": "1",
    "from_email": "0",
    "nadir": "0",
    "branding_logo": "0",
    "from_email_value": ''
  };

  /**
   * @property \{{{boolean}}\} {{configurationUpdatedError}} {{as per form post error server side 
   *                                                          this boolean value will be changed}}
   */
  configurationUpdatedError: boolean = false;
 /**
   * @property \{{{boolean}}\} {{configurationUpdatedSuccess}} {{configuration update success status}}
   */
  configurationUpdatedSuccess: boolean = false;
  /**
   * @property \{{{boolean}}\} {{isFormUpdatePostFail}} {{as per this boolean value form update fail 
   *                                                      notification alert will be pop out}}
   */
  isFormUpdatePostFail:boolean = false;

  /**
   * @property \{{{any}}\} {{configurationFormUpdatePostErrorObj}} {{when post fail the error then 
   *                                                                the error object will store here}}
   */
  configurationFormUpdatePostErrorObj:any = [];


  constructor(
    private userService: UserService,
    private languageservice: LanguageService
  ) {}

    /**
   * @func {{updateMyProfile}}
   * @description {{this is update my profile submit function. Update the details in the server}}
   */
  updateMyConfiguration():void {
    this.configObj.api_token=this.authUser.api_token;
    this.configObj.config_id=this.configObj.id;
    // console.log(this.configObj);
    this.userService.updateMyConfiguration(this.configObj)
      .subscribe(
        data => {
          if (data.status === 'success') {
            // console.log(data)
            // this.configurationUpdatedSuccess = true;
            // this.configurationUpdatedError = false;
            // this.isFormUpdatePostFail=false;
            this.btmmsgs = [];
            this.btmmsgs.push({severity:'success', summary:'Success', detail:'Successfully done the configaration update'});
          }
          if(data.status === 'fail'){
            //  console.log(data)
           this.configurationUpdatedError = false;
           this.isFormUpdatePostFail=true;
           this.configurationFormUpdatePostErrorObj = data;
           this.configurationUpdatedSuccess = false;
          }
        },
        error => {
          // console.log(error);
          let err = error.json() || 'other';
          console.log(err);
          this.configurationUpdatedError = true;
          this.configurationUpdatedSuccess = false;
          this.configurationUpdatedError = false;
        });
  }


  /**
   * @private 
   * @method {{formUpdateErrorPostFailClose}}
   * @description {{form updated fail post server related message alert show}}
   */
  private formUpdateErrorPostFailClose():void {
    this.configurationUpdatedError = false;
  }

  /**
   * @private 
   * @method {{cofigurationUpdatedSuccessClose}}
   * @description {{form updated successfully message alert show}}
   */
  private configurationUpdatedSuccessClose():void {
    this.configurationUpdatedSuccess = false;
  }

  ngOnInit() {

     // get auth user form the service and set the value 'this.authUser' property
    this.authUser = this.userService.getAuthUser();

    // this is set the initial lang property if there is no lang property
    this.languageservice.initialLang();

    // set the initial user language
    this.userLanguage = this.languageservice.getUserLang();

    // check if language object has value or not
    if(this.userLanguage.length == 0){
      this.userLanguage = '';
      // console.log(this.userLanguage);
    } else {
      this.userLanguage = JSON.parse(this.languageservice.getUserLang())
      // console.log(this.userLanguage.locale);
    }

    // get me profile data from service by subscribe amd set the value 'this.profileDetails' property
    this.userService.getMyConfiguration(this.authUser.api_token, this.userLanguage.locale, this.authUser.org_id)
       .subscribe(configurationData => this.configurationDetails = configurationData)
       //  .subscribe(function(configurationData){
       //    console.log(configurationData)
       //  });

       // get the single configuration
    this.userService.getMyConfiguration(this.authUser.api_token, this.userLanguage.locale, this.authUser.org_id)
        // setting subscribe method by es5 way
        .subscribe(function(configurationData){
          $('.setting-http-load, .linear-progress').fadeOut()
          // set local vars  for the configuration
          // console.log(configurationData.configuration == null)
          if(configurationData.configuration == null){
            console.log('Nothing to do with the local object')
            this.msgs.push({severity:'warn', summary:'Warn Message !', detail:'Please setup your organaization first.'});
          }
          else{
            this.msgs = [];
            this.configObj = configurationData.configuration;
          }
          // checking if lenght is 0 or not
         // console.log(this.configObj);
        }.bind(this))
      

  }

}

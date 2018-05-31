import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../_services/user.service';
import {AdminService} from '../../../_services/admin.service';
import * as config from '../../../config';

import {Message} from 'primeng/primeng';

// for jquery
declare var $: any;

@Component({
  selector: 'app-client-localization',
  templateUrl: './client-localization.component.html',
  styleUrls: ['./client-localization.component.css']
})
export class ClientLocalizationComponent implements OnInit {

  /**
   * @property \{{{Message[]}}\} {{allMessage}} {{This is used from "primeng" plugin growl notification}}
   */
  allMessage: Message[] = [];
  /**
   * @property \{{{any}}\} {{authUser}} {{store the auth user data from the localstorage}}
   */
  authUser: any;
  /**
   * @property \{{{any}}\} {{localizationPostObj}} {{make the abject on init for the post}}
   */
  localizationPostObj: any = [];
  /**
   * @property \{{{any}}\} {{languageTable}} {{Hold the all language list table}}
   */
  languageTable: any = [];
  /**
   * @property \{{{any}}\} {{currenciesTable}} {{Hold the all currencies list table}}
   */
  currenciesTable: any = [];
  /**
   * @property \{{{boolean}}\} {{addLanguagePop}} {{this will show hide the add language popup}}
   */
  addLanguagePop: boolean = false;
  /**
   * @property \{{{boolean}}\} {{editLanguagePop}} {{this will show hide the edit language popup}}
   */
  editLanguagePop: boolean = false;
  /**
   * @property \{{{boolean}}\} {{addCurrenciesPop}} {{this will show hide the add currencies popup}}
   */
  addCurrencyPop: boolean = false;
  /**
   * @property \{{{boolean}}\} {{editCurrencyPop}} {{this will show hide the edit currencies popup}}
   */
  editCurrencyPop: boolean = false;
  /**
   * @property \{{{any}}\} {{editCurrencyObj}} {{local edit currency value store}}
   */
  editCurrencyObj: any = {};
  /**
   * @property \{{{object}}\} {{addedLanguageObj}} {{local add language value store}}
   */
  addedLanguageObj: any = {
    api_token: '',
    status: true,
    name: '',
    locale: ''
  };
  /**
   * @property \{{{any}}\} {{editLanguageObj}} {{local edit language value store}}
   */
  editLanguageObj: any = {};
  /**
   * @property \{{{object}}\} {{addedCurrencyObj}} {{local added currency value store}}
   */
  addCurrencyObj: any;


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
   * @private
   * @func {{addLanguagePopupTrigger}}
   * @description {{this will trigger the show hide popup on click the add language button}}
   */
  addLanguagePopupTrigger() {
      this.addLanguagePop = true;
  }

  /**
   * @private
   * @func {{addCurrencyPopupTrigger}}
   * @description {{this will trigger the show hide popup on click the add add currency button}}
   */
  addCurrencyPopupTrigger() {
      this.addCurrencyPop = true;
  }

  /**
   * @func {{addLanguageSave}}
   * @description {{this method will add the language in the language list table}}
   */
  addLanguageSave(){
    // create a local object
    let addLangObj={};
    if(this.addedLanguageObj.status == true){
      addLangObj = {
        api_token: this.addedLanguageObj.api_token,
        status: 1,
        name: this.addedLanguageObj.name,
        locale: this.addedLanguageObj.locale
      }
    }
    if(this.addedLanguageObj.status == false){
      addLangObj = {
        api_token: this.addedLanguageObj.api_token,
        status: 0,
        name: this.addedLanguageObj.name,
        locale: this.addedLanguageObj.locale
      }
    }
    

    // service call admin add language
    this.adminService.adminAddLanguage(addLangObj)
      .subscribe(
        data => {
          if(data.status == "success"){
            // hide pop up
            this.addLanguagePop = false;
            // get all language service call again
            this.getAllLanguageSubscribe(this.localizationPostObj);
            // add language message push on growl
            this.allMessage = [];
            this.allMessage.push({severity:'success', summary:'Success', detail:'One new language added'});
            // initial state set ad language object model
            this.addedLanguageObj= {
              api_token: this.authUser.api_token,
              status: true,
              name: '',
              locale: ''
            };
          }
          if(data.status == "fail"){
            alert('You are not a admin');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      ) 
  }

  /**
   * @func {{editLanguage}}
   * @param \{{{any}}\} {{event}} {{store the local clickable object value}}
   */
  private editLanguage(event){
    this.editLanguagePop = true;
    this.editLanguageObj = {
      api_token: this.authUser.api_token,
      locale: event.locale,
      name: event.name,
      status: event.status,
      id: event.id
    };
    // this.editLanguageObj = event;
  }

  /**
   * @func {{editLanguageSave}}
   * @description {{this method will call after edit saved}}
   */
  editLanguageSave(){
    this.adminService.adminEditLanguage(this.editLanguageObj)
      .subscribe(
        data => {
          if(data.status == "success"){
            // hide pop up
            this.editLanguagePop = false;
            // get all language service call again
            this.getAllLanguageSubscribe(this.localizationPostObj);
            // edited language message push on growl
            this.allMessage = [];
            this.allMessage.push({severity:'success', summary:'Success', detail:'Language edited successfully'});
          }
          if(data.status == "fail"){
            alert('You are not a admin');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      )
    // this.editLanguagePop = false;
  }

  /**
   * @func {{deleteLanguage}}
   * @param \{{{any}}\} {{event}} {{store the local clickable object value}}
   * @description {{this method will when delate a single language}}
   */
  private deleteLanguage(event){
    // create the local object for delate language
    let deleteLang = {
      api_token: this.authUser.api_token,
      id: event.id
    }
    // console.log(deleteLang);
    // delete language service call and subscribe
    this.adminService.adminDeleteLanguage(deleteLang)
      .subscribe(
        data => {
          if(data.status == "success"){
            // get all language service call again
            this.getAllLanguageSubscribe(this.localizationPostObj);
            // deleted language message push on growl
            this.allMessage = [];
            this.allMessage.push({severity:'error', summary:'Deleted', detail:'Language deleted successfully'});
          }
          if(data.status == "fail"){
            alert('You are not a admin');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      )
  }

  /**
   * @func {{addCurrencySave}}
   * @description {{this method will add the currency by calling the service for add currency}}
   */
  addCurrencySave(){
    // make a local currency obj
    let currenyMkObj = {
      api_token: this.addCurrencyObj.api_token,
      status: this.addCurrencyObj.status ? 1 : 0,
      default: this.addCurrencyObj.default ? 1 : 0,
    }
    // this is add currency service call
    this.adminService.adminAddCurrency(this.addCurrencyObj)
      .subscribe(
        data => {
          if(data.status == "success"){
            // hide pop up
            this.addCurrencyPop = false;
            // get all language service call again
            this.getAllCurrencySubscribe(this.localizationPostObj);
            // add currency message push on growl
            this.allMessage = [];
            this.allMessage.push({severity:'success', summary:'Success', detail:'Currency added successfully'});
            // initial state set add currency object model
            this.addCurrencyObj = {
              api_token: this.authUser.api_token,
              status: true,
              default: false
            };
          }
          if(data.status == "fail"){
            alert('You are not a admin');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{editCurrency}}
   * @param \{{{any}}\} {{event}} {{store the local clickable object value}}
   */
  private editCurrency(event){
    // console.log(event);
    this.editCurrencyPop = true;
    // this.editCurrencyObj = event;
    this.editCurrencyObj = {
      api_token: this.authUser.api_token,
      name: event.name,
      symbol: event.symbol,
      base_rate: event.base_rate,
      default: event.default,
      status: event.status,
      id: event.id
    };
  }

  /**
   * @func {{editCurrencySave}}
   * @description {{this will save the edited currency object in the DB by service call}}
   */
  editCurrencySave(){
    this.adminService.adminEditCurrency(this.editCurrencyObj)
      .subscribe(
        data => {
          if(data.status == "success"){
            // hide pop up
            this.editCurrencyPop = false;
            // get all currency service call again
            this.getAllCurrencySubscribe(this.localizationPostObj);
            // edited currency message push on growl
            this.allMessage = [];
            this.allMessage.push({severity:'success', summary:'Success', detail:'Currency edited successfully'});
          }
          if(data.status == "fail"){
            alert('You are not a admin');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      )
  }

  /**
   * @func {{deleteCurrency}}
   * @param \{{{any}}\} {{event}} {{store the local clickable object value}}
   * @description {{this method will when delate a single currency}}
   */
  private deleteCurrency(event){
    // console.log(event)
    // create the local object for delate currency
    let deleteCurrency = {
      api_token: this.authUser.api_token,
      id: event.id
    }
    // delete currency service call and subscribe
    this.adminService.adminDeleteCurrency(deleteCurrency)
      .subscribe(
        data => {
          if(data.status == "success"){
            // get all currency service call again
            this.getAllCurrencySubscribe(this.localizationPostObj);
            // deleted currency message push on growl
            this.allMessage = [];
            this.allMessage.push({severity:'error', summary:'Deleted', detail:'Currency deleted successfully'});
          }
          if(data.status == "fail"){
            // console.log(data);
            // set a deafult currency message push on growl
            this.allMessage = [];
            this.allMessage.push({severity:'warn', summary:'Warning', detail:data.message});
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      )
  }
  
  /**
   * @func {{getAllLanguageSubscribe}}
   * @param \{{{object}}\} {{localizationPostObj}} {{post the initial data}}
   * @description {{this method will fetch the all language data}}
   */
  private getAllLanguageSubscribe(localizationPostObj){
    this.adminService.adminLocalizationData(localizationPostObj)
      .subscribe(
        data => {
          $('.setting-http-load, .linear-progress').fadeOut();
          if(data.status == "success"){
            // console.log(data)
            this.languageTable = data.language;
            // loader remove
            $('.setting-http-load').fadeOut();
          }
          if(data.status == "fail"){
            alert('You are not a admin');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      )
  }

  /**
   * @func {{getAllCurrencySubscribe}}
   * @param \{{{object}}\} {{localizationPostObj}} {{post the initial data}}
   * @description {{this method will fetch the all currency data}}
   */
  private getAllCurrencySubscribe(localizationPostObj){
    this.adminService.adminLocalizationData(localizationPostObj)
      .subscribe(
        data => {
          $('.setting-http-load, .linear-progress').fadeOut();
          if(data.status == "success"){
            this.currenciesTable = data.currencies;
          }
          if(data.status == "fail"){
            alert('You are not a admin');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      )
  }


  /**
   * @func {{ngOnInit}}
   * @description {{This is on init lifecycle hook}}
   */
  ngOnInit() {
    // set the auth user and store the data in the localstorage
    this.authUser = this.userService.getAuthUser();

    // make initial add language object model
    this.addedLanguageObj= {
      api_token: this.authUser.api_token,
      status: true,
      name: '',
      locale: ''
    };
    

    // make initial add currency object model
    this.addCurrencyObj = {
      api_token: this.authUser.api_token,
      status: true,
      default: false
    };

    // create the "localizationPostObj" table post data object
    this.localizationPostObj = {api_token:this.authUser.api_token};
    
    // get all "language" data
    this.getAllLanguageSubscribe(this.localizationPostObj);

    // get all "currencies" data
    this.getAllCurrencySubscribe(this.localizationPostObj);

  }

}

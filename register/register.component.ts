import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from './../api/authentication.service';
import {Message} from 'primeng/primeng';
import { appConfig } from './../appConfig';

import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  recaptchaKey: any = appConfig.recaptcha_sitekey;

  msgs: Message[] = [];

  btndisabled: any = false;

  /**
   * @property \{{{SocialUser}}\} {{user}} {{to store the social user data}}{{}}
   */
  user: any;

  /**
   * @property \{{{type}}\} {{model}} {{ng model bind data}}
   */
  model: any = {
    location: '',
    lat: '',
    lng: '',
    yyyy: '2018',
    mm: '01',
    dd: '1',
    recaptcha: ''
  };

  /**
   * @property \{{{any}}\} {{date_of_birth}} {{to concate date of birth}}
   */
  date_of_birth: any;



  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private socialAuthService: AuthService
  ) { }




  GsocialLogin() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;

      console.log(this.user);

      if (this.user !== null) {
        const socialuser = {
          name: this.user.name,
          email: this.user.email,
          photourl: this.user.photoUrl,
          provider: this.user.provider
        };
        // console.log(socialuser)
        const userdata = JSON.stringify(socialuser);
        sessionStorage.setItem('meraSecond', userdata);
        // go
        this.router.navigate([`/social-second-step`]);
      }
      // console.log(this.user);
    });
  }


  FBsocialLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;

      if (this.user !== null) {
        const socialuser = {
          name: this.user.name,
          email: this.user.email,
          photourl: this.user.photoUrl,
          provider: this.user.provider
        };
        // console.log(socialuser)
        const userdata = JSON.stringify(socialuser);
        sessionStorage.setItem('meraSecond', userdata);
        // go
        this.router.navigate([`/social-second-step`]);
      }
      // console.log(this.user);
    });
  }



  /**
   * @function {{signUp}}
   * @description {{this will service call and store the response}}
   */
  signUp() {

    // make btn disabled
    this.btndisabled = true;

    // console.log(value);
    this.date_of_birth =  `${this.model.yyyy}-${this.model.mm}-${this.model.dd}`;
    // console.log(this.date_of_birth);
    const regObj = {
      first_name: this.model.firstName,
      last_name: this.model.lastName,
      email: this.model.email,
      password: this.model.password,
      date_of_birth: this.date_of_birth,
      gender: this.model.gender,
      latitude: this.model.lat,
      longitude: this.model.lng,
      location: this.model.location,
      is_terms_accepted: 'Y',
    };
    // console.log(regObj);
    if (regObj.latitude !== '' && regObj.longitude !== '') {
      if (this.model.recaptcha !== '') {
        this.authService.normalRegister(regObj)
        .subscribe(
          (data: any) => {
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: 'Success', detail: 'Please verify your email to signin'});
            // go
            setTimeout(() => {
              this.router.navigate([`/login`]);
            }, 3000);
          },
          err => {
            // make btn disabled
            this.btndisabled = false;
            // console.log(err.status);
            if (err.status == 400) {
              this.msgs = [];
              this.msgs.push({severity: 'error', summary: 'Error', detail: 'Registration Failed'});

              if ( err.error.errors.email == 'The email has already been taken.') {
                this.msgs = [];
                this.msgs.push({severity: 'error', summary: 'Error', detail: 'Email is already registered.'});
                // this.shownotiInfo('info', 'Email is already registered.');
              }
            }
          }
        );
      } else {
        // make btn disabled
        this.btndisabled = false;
        // alert('Please select the valid address from the suggestion');
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Error', detail: 'Confirm you are not a robot.'});

        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      }
    } else {
      // make btn disabled
      this.btndisabled = false;
      // alert('Please select the valid address from the suggestion');
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: 'Error', detail: 'Need a valid location.'});

      setTimeout(() => {
        this.msgs = [];
      }, 1500);
    }
  }


  /**
   * @function {{autoCompleteCallback1}}
   * @description {{this is used for location auto complete}}
   */
  autoCompleteCallback1(selectedData: any) {
    // console.log(selectedData);
    if (selectedData.response !== false) {
      this.model.lat = selectedData.data.geometry.location.lat;
      this.model.lng = selectedData.data.geometry.location.lng;
      this.model.location = selectedData.data.formatted_address;
    } else {
      alert('Please select a location from the suggestion');
    }
  }


  resolved(captchaResponse: string) {
      this.model.recaptcha = captchaResponse;
      // console.log(`Resolved captcha with response ${captchaResponse}:`);
  }




  ngOnInit() {
    $('body').find('header').addClass('hide-hf');
    $('body').find('footer').addClass('hide-hf');
    $('body').addClass('autharea');
  }


  ngOnDestroy() {
    $('body').find('header').removeClass('hide-hf');
    $('body').find('footer').removeClass('hide-hf');
    $('body').removeClass('autharea');
  }

}

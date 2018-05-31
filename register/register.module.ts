import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from './../api/authentication.service';

import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import {MessagesModule} from 'primeng/messages';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { appConfig } from './../appConfig';

import { RegisterComponent } from './register.component';


const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(appConfig.google_OAuth_client)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(appConfig.fb_app_id)
  }
]);
export function provideConfig() {
  return config;
}


// intro routing
export const routes: Routes = [
  { path: '', component: RegisterComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomFormsModule,
    Ng4GeoautocompleteModule.forRoot(),
    RecaptchaModule.forRoot(),
    MessagesModule,
    RecaptchaFormsModule,
    RouterModule.forChild(routes),
    SocialLoginModule
  ],
  declarations: [RegisterComponent],
  providers: [
    {provide: AuthServiceConfig, useFactory: provideConfig},
    AuthenticationService
  ]
})
export class RegisterModule { }

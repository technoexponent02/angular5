import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';


import { NgDatepickerModule } from 'ng2-datepicker';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import {MessagesModule} from 'primeng/messages';

import { CommonService } from './../api/common.service';
import { ProfileSettingService } from './../api/profile-setting.service';

import { ProfileSettingComponent } from './profile-setting.component';
import { AccountComponent } from './account/account.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SecurityComponent } from './security/security.component';
import { BlockedComponent } from './blocked/blocked.component';



// intro routing
export const routes: Routes = [
  { path: '', component: ProfileSettingComponent },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomFormsModule,
    RouterModule.forChild(routes),
    Ng4GeoautocompleteModule.forRoot(),
    MessagesModule,
    NgDatepickerModule
  ],
  declarations: [
    ProfileSettingComponent,
    AccountComponent,
    PrivacyComponent,
    SecurityComponent,
    BlockedComponent
  ],
  providers: [
    CommonService,
    ProfileSettingService,
  ]
})
export class ProfileSettingsModule { }

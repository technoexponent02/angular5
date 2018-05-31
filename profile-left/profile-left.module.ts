import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

// 3rd party
import { ModalModule } from 'ngx-bootstrap';
import { NgDatepickerModule } from 'ng2-datepicker';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import {MessagesModule} from 'primeng/messages';

import { ProfileLeftUtilComponent } from './profile-left-util.component';
import { ProfileAboutComponent } from './profile-about/profile-about.component';
import { ProfileEducationComponent } from './profile-education/profile-education.component';
import { ProfileExperienceComponent } from './profile-experience/profile-experience.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    Ng4GeoautocompleteModule.forRoot(),
    MessagesModule,
    NgDatepickerModule
  ],
  declarations: [
    ProfileLeftUtilComponent,
    ProfileAboutComponent,
    ProfileEducationComponent,
    ProfileExperienceComponent
  ],
  providers: [
  ],
  exports: [
    ProfileLeftUtilComponent
  ]
})
export class ProfileLeftModule { }

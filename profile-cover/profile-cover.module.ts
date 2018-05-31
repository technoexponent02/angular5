import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap';
import {ImageCropperModule} from 'ng2-img-cropper';
import { LazyLoadImageModule } from 'ng-lazyload-image';


import { CommonService } from './../../api/common.service';
import { HeaderService } from './../../api/header.service';

import { ProfileCoverComponent } from './profile-cover.component';
import { ProfileImageComponent } from './profile-image/profile-image.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ModalModule.forRoot(),
    ImageCropperModule,
    LazyLoadImageModule
  ],
  declarations: [
    ProfileCoverComponent,
    ProfileImageComponent
  ],
  providers: [
    CommonService,
    HeaderService
  ],
  exports: [
    ProfileCoverComponent
  ]
})
export class ProfileCoverModule { }

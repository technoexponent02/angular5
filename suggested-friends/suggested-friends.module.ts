import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { CommonService } from './../../api/common.service';
import { SuggestedService } from './../../api/suggested.service';

import { SuggestedFriendsComponent } from './suggested-friends.component';
import { SmallWidgetComponent } from './small-widget/small-widget.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    InfiniteScrollModule
  ],
  declarations: [
    SuggestedFriendsComponent,
    SmallWidgetComponent
  ],
  providers: [
    CommonService,
    SuggestedService
  ],
  exports: [
    SuggestedFriendsComponent,
    SmallWidgetComponent
  ]
})
export class SuggestedFriendsModule { }

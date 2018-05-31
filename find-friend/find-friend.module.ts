import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { ProfileCoverModule } from './../components/profile-cover/profile-cover.module';
import { SuggestedFriendsModule } from './../components/suggested-friends/suggested-friends.module';

import { CommonService } from './../api/common.service';
import { FriendService } from './../api/friend.service';


import { FindFriendComponent } from './find-friend.component';


// routing
export const routes: Routes = [
  { path: '', component: FindFriendComponent }
];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProfileCoverModule,
    SuggestedFriendsModule
  ],
  declarations: [FindFriendComponent],
  providers: [
    CommonService,
    FriendService
  ]
})
export class FindFriendModule { }

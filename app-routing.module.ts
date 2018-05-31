import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { PreloadAllModules } from '@angular/router';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';

import { AuthGuard } from './guard/auth-guard.guard';
import { PublicGuard } from './guard/public-guard.guard';

import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: './intro/intro.module#IntroModule',
    pathMatch: 'full',
    canActivate: [PublicGuard]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    pathMatch: 'full',
    canActivate: [PublicGuard]
  },
  {
    path: 'forget-password',
    loadChildren: './forget-password/forget-password.module#ForgetPasswordModule',
    pathMatch: 'full',
    canActivate: [PublicGuard]
  },
  {
    path: 'register',
    loadChildren: './register/register.module#RegisterModule',
    pathMatch: 'full',
    canActivate: [PublicGuard]
  },
  {
    path: 'profile/:id',
    loadChildren: './profile/profile.module#ProfileModule',
    pathMatch: 'full',
    // data: { preload: true },
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-setting',
    loadChildren: './profile-settings/profile-settings.module#ProfileSettingsModule',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'password',
    loadChildren: './reset-password/reset-password.module#ResetPasswordModule',
    canActivate: [PublicGuard]
  },
  {
    path: 'social-second-step',
    loadChildren: './login-second/login-second.module#LoginSecondModule',
    canActivate: [PublicGuard]
  },
  {
    path: 'register/confirm-email/:id',
    loadChildren: './email-confirm/email-confirm.module#EmailConfirmModule',
    pathMatch: 'full',
    canActivate: [PublicGuard]
  },
  {
    path: 'people-you-may-know',
    loadChildren: './people-you-know/people-you-know.module#PeopleYouKnowModule',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: ':id/friends',
    loadChildren: './friends/friends.module#FriendsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'find-friend',
    loadChildren: './find-friend/find-friend.module#FindFriendModule',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'friend-request',
  //   loadChildren: './friend-request/friend-request.module#FriendRequestModule',
  //   pathMatch: 'full',
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: ':id/follow',
  //   loadChildren: './follow/follow.module#FollowModule',
  //   pathMatch: 'full',
  //   canActivate: [AuthGuard]
  // }
];




// @NgModule({
//   imports: [RouterModule.forRoot(routes, {preloadingStrategy: SelectivePreloadingStrategy})],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}


import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthServices } from './../../../../_services/auth.service';
import { CommonService } from './../../../../_services/common.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { TdDialogService } from '@covalent/core';
import { appConfig } from '../../../../app.config';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
	/**
	 * @property \{{{boolean}}\} {{loggedIn}} {{this will check the user is loged in or not}}
	 */
	loggedIn: boolean = false;
	/**
	 * @property \{{{type}}\} {{name}} {{description}}{{}}
	 */
	authUser: any = '';
	/**
	 * @property \{{{any}}\} {{profileimage}} {{this will store the profile image}}
	 */
	profileimage: any = null;
	/**
	 * @property \{{{any}}\} {{musiciansUser}} {{here store the musicians profile username}}
	 */
	musiciansUser: any = '';
	/**
	 * @property \{{{any}}\} {{hideMenu}} {{hideMenu if there is no user}}
	 */
	hideMenu: any = true;
	/**
   * @property \{{{any}}\} {{musicianLinkData}} {{this will hold the musician data}}
   */
	musicianLinkData: any = {
		name: '',
		image: '',
	};


	/**
	 * @constructor
	 * @description {{DI will pushed here}}
	 */
	constructor(
		private sanitizer: DomSanitizer,
		private authService: AuthServices,
		private commonService: CommonService,
		private route: ActivatedRoute,
		private router: Router,
		private _dialogService: TdDialogService,
    	private _viewContainerRef: ViewContainerRef
	) {
		router.events.forEach((event) => {
			if (event instanceof NavigationStart) {
				$(document).find('body').append('<div id="splashloader" class="innerpages"> <div id="spinner"> <img src="assets/images/logo.png"> <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> </div> </div>')
			}
			if (event instanceof NavigationEnd) {
				$(document).find('#splashloader').remove();
			}
			if (event instanceof NavigationCancel) {
				$(document).find('#splashloader').remove();

				// this._dialogService.openAlert({
				// 	message: 'Please login first before visit this link.'
				// });

			}
			if (event instanceof NavigationError) {
				$(document).find('#splashloader').remove();
			}
			// NavigationEnd
			// NavigationCancel
			// NavigationError
			// RoutesRecognized
		});
	}


	/**
	 * @func {{logout}}
	 * @description {{clear the localstorage value to logout from the app}}
	 */
	logout(){
		$(".popupOverlay").removeClass("show");
		this.authService.logout();
	}

	/**
	 * @func {{registrationPop}}
	 * @description {{this will show the registration popup}}
	 */
	registrationPop(){
		$("body").addClass("popupOpen");
		$(".popupOverlay").addClass("show");
		$(".customPopup").removeClass("show");
		setTimeout(()=>{
			$('app-register').find("#registerPopup").addClass('show').addClass('viewScreen');
		}, 150);
	}

	closemenu(){
		$('body').removeClass('smnavShow');
	}


	/**
	 * @func {{loginPop}}
	 * @description {{this will show the login popup}}
	 */
	loginPop(){
		$("body").addClass("popupOpen");
		$(".popupOverlay").addClass("show");
		$(".customPopup").removeClass("show");
		setTimeout(()=>{
			$('app-login').find("#loginPopup").addClass('show').addClass('viewScreen');
		}, 150);
	}


	/**
   * @func {{musicianProfileSet}}
   * @description {{this function will set the musician set}}
   */
  musicianProfileSet(userName) {
    // fetch the user details
    this.commonService.musiciansDetails(userName)
      .subscribe(
        (data: any) => {
          // get all user data
          const userData = data;
          // making view
          this.musicianLinkData.name = `${userData.personaldata.firstname}`;
          this.musicianLinkData.image = `url(${appConfig.publicuploadfolder}${userData.personaldata.profile_image})`;
        },
        err => {
          console.log(err);
          alert('something went wrong in the server!');
        }
      );
  }



	/**
	 * @func {{ngOnInit}}
	 * @description {{this is angular lifecycle hook}}
	 */
 	ngOnInit() {
		/* POPUP START */
		// $("body").on("click",".popupClick", function(event){
		// 	event.preventDefault();
		// 	var popShow = $(this).attr("href");
		// 	$("html, body").animate({scrollTop: 0}, 400);
		// 	$("body").addClass("popupOpen");
		// 	$(".popupOverlay").addClass("show");
		// 	$(".customPopup").removeClass("show");
		// 	$(popShow).addClass("show");
		// });
		// $("body").on("click",".popupOverlay, .popupClose", function(){
		// 	$("body").removeClass("popupOpen");
		// 	$(".popupOverlay").removeClass("show");	
		// 	$(".customPopup").css({"display":"none"});
		// 	setTimeout(function(){
		// 		$(".customPopup").removeClass("show").css({"display":"block"});
		// 	}, 600);
			
		// });
		/* POPUP END */
		let queryString = window.location.search || '';
		queryString = queryString.substr(1);

		if (queryString.length > 0) {
			if (queryString == 'account_verification=success') {
				// alert('yes got it')
				this.loginPop();
			}
		};


	
		// assign the auth user
		this.authUser = this.authService.getAuthUser();

		// console.log( localStorage.getItem('YamubaHeaderCover') ,  sessionStorage.getItem('yamubaUser'))


		if(sessionStorage.getItem('yamubaUser') !== null && localStorage.getItem('YamubaHeaderCover') !== null){
			// console.log( localStorage.getItem('YamubaHeaderCover'));
			const profileimage = JSON.parse(localStorage.getItem('YamubaHeaderCover')).profileImage.imagesource.image;
			this.profileimage = this.sanitizer.bypassSecurityTrustStyle(`url(${profileimage})`);
		}
		// get profile image
		// const profileimage = JSON.parse(localStorage.getItem('YamubaHeaderCover')).profileImage.imagesource.image;
		// this.profileimage = this.sanitizer.bypassSecurityTrustStyle(`url(${profileimage})`);



		// check the loggedin user
		if(this.authService.isLoggedIn()){
			this.loggedIn = true;
			this.musicianProfileSet(this.authUser.username);
		}



		// set the urls
		this.musiciansUser = this.authService.getAuthUser().username;
		if(this.authService.getAuthUser().username == 'guest'){
			this.hideMenu = false;
		}


	}

}

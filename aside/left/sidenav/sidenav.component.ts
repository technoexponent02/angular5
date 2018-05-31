import { Component, OnInit } from '@angular/core';
// Base 64 IMage display issues with unsafe image
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from './../../../../../_services/common.service';
import { AuthServices } from './../../../../../_services/auth.service';
import { appConfig } from '../../../../../app.config';

declare var $: any;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{isguest}} {{this will check the is guest user}}
   */
  isguest: any = false;
  /**
   * @property \{{{any}}\} {{musicianLinkData}} {{this will hold the musician data}}
   */
  musicianLinkData: any = {
    name: '',
    image: '',
    link: ''
  };
  /**
   * @property \{{{any}}\} {{bandListData}} {{this will hold the user band list}}
   */
  bandListData: any = [];
  /**
   * @property \{{{any}}\} {{profileid}} {{this will hold the profile name}}
   */
  profileid: any;


  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private authService: AuthServices
  ) {
    // get the user name from the profile
    this.route.params.subscribe(params => {
      this.profileid = params['id'];
    });
  }


  /**
   * @func {{isGusetCheck}}
   * @description {{this will check the is user is guest user}}
   */
  isGusetCheck() {
    if ( JSON.parse(sessionStorage.getItem('yamubaUser')).token == 'guest' ) {
      this.isguest = false;
    } else {
      this.isguest = true;
    }
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
          this.musicianLinkData.name = `${userData.personaldata.firstname} ${userData.personaldata.lastname}`;
          this.musicianLinkData.link = `/m/${userData.user_profilelink}/info`;
          this.musicianLinkData.image = `url(${appConfig.publicuploadfolder}${userData.personaldata.profile_image})`;
        },
        err => {
          console.log(err);
          alert('something went wrong in the server!');
        }
      );
  }




  /**
   * @func {{setBandData}}
   * @description {{this will set the band profile}}
   */
  setBandData($bandData) {
    const bandList = $bandData.map(band => ({id: band.band_id, username: band.band_username}));
    const authUserLoacal = JSON.parse(localStorage.getItem('yamubaUser'));
    const authUserSession = JSON.parse(sessionStorage.getItem('yamubaUser'));
    let authBandProfileLocal = JSON.parse(localStorage.getItem('yamubaBandProfile'));
    // console.log($bandData, bandList);

    // set the data
    authUserLoacal.band_username = bandList;
    authUserSession.band_username = bandList;
    authBandProfileLocal = bandList;

    // console.log(authUserLoacal, authUserSession)
    // console.log(authBandProfileLocal)

    // set the data to the local and session
    localStorage.setItem('yamubaUser', JSON.stringify(authUserLoacal));
    sessionStorage.setItem('yamubaUser', JSON.stringify(authUserSession));
    localStorage.setItem('yamubaBandProfile', JSON.stringify(authBandProfileLocal));
  }



  /**
   * @func {{fetchBand}}
   * @description {{this will fetch all the band list}}
   */
  fetchBand() {
    // fetch all the band list
    this.commonService.getUserBandList(this.profileid.username)
      .subscribe(
        (data: any) => {
          if (data.status == 1) {
            this.bandListData = data.band_list;


            const filteredBand = this.bandListData.filter(b => b.member_type == 1 || b.member_type == 3);
            // console.log(this.bandListData, filteredBand)


            // set band data
            this.setBandData(filteredBand);

            // settings loader removed
            // $('#settingsloading').fadeOut();
          }
          if (data.status == 0) {
            console.log(data.message);
            // settings loader removed
            // $('#settingsloading').fadeOut();
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }



  /**
   * @func {{ngOnInit}}
   * @description {{This is angular lifecycle hook}}
   */
  ngOnInit() {
    this.profileid = this.authService.getAuthUser();

    // is this guest user
    this.isGusetCheck();
    //  check guset then profile set
    if (this.isguest) {
      // set musicians profile
      this.musicianProfileSet(this.profileid.username);
      // set band profile
      this.fetchBand();

    }


  }

}

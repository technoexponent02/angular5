import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-find-friend',
  templateUrl: './find-friend.component.html',
  styleUrls: ['./find-friend.component.css']
})
export class FindFriendComponent implements OnInit, AfterViewInit {
  /**
   * @property \{{{any}}\} {{searchState}} {{this will toogle the search state view}}
   */
  searchState: any = false;


  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor() { }



  searchfrnd() {
    // change the search state
    this.searchState = true;
  }




  /**
   * @func {{ngOnInit}}
   * @description {{this is angular lifecycle hook}}
   */
  ngOnInit() {
    // todo
  }


  ngAfterViewInit() {
    // snimati scroll down
    $('body, html').animate({
      scrollTop: $('#searchFrm').offset().top - 105
    }, 600);
  }

}

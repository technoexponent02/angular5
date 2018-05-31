import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css'],
})
export class LeftComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{searchFilter}} {{this will hold the search filter data}}
   */
  @Input() searchFilter: any;


  constructor() { }
  

  ngOnInit() {
  }

}

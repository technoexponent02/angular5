import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('#banner').flexslider({
			animation:"fade",
			slideshow:true,
			pauseOnAction:false,
			slideshowSpeed:4000, 
			animationSpeed:1200, 
			controlNav:true,
			directionNav: false,
			animationLoop:true
		});	
  }

}

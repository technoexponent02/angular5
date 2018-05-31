import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { 
    // make dummy guest login
    const guest = {
      token: 'guest',
      username: 'guest'
    };
    // set the seccion
    if (sessionStorage.getItem('yamubaUser') == null){
      sessionStorage.setItem('yamubaUser', JSON.stringify(guest));
    }

  }

  ngOnInit() {

    // sessionStorage data transfar to the nxt tab
    if (localStorage.getItem('yamubaUser') !== null) {
      const getLocalStorageVal = localStorage.getItem('yamubaUser');
      sessionStorage.setItem('yamubaUser', getLocalStorageVal);
    }

  }

}

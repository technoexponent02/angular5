import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../../_services/common.service';
import { MusiciansService } from '../../../../../_services/musicians.service';
import { DataService } from '../../../../../_services/data.service';

declare var $: any;

@Component({
  selector: 'app-musician-filter',
  templateUrl: './musician-filter.component.html',
  styleUrls: ['./musician-filter.component.css']
})
export class MusicianFilterComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{searchData}} {{this will hold the search result}}
   */
  searchData: any;
  /**
   * @property \{{{any}}\} {{musiciansTypeList}} {{this will fetch the musicians type list}}
   */
  musiciansTypeList: any = [];
  /**
   * @property \{{{any}}\} {{instrumentList}} {{this will fetch theinstrument list}}
   */
  instrumentList: any = [];
  /**
   * @property \{{{any}}\} {{genreList}} {{this will fetch genre list}}
   */
  genreList: any = [];
  /**
   * @property \{{{any}}\} {{pstatus}} {{this will fetch proffesional status list}}
   */
  pstatus: any = [];
  /**
   * @property \{{{any}}\} {{allCountryList}} {{this will hold the all country list}}
   */
  allCountryList: any = [];



  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private data: DataService,
    private commonService: CommonService,
    private musiciansService: MusiciansService
  ) { }


  /**
   * @func {{scrollSearchList}}
   * @description {{this will scroll down the search result area}}
   */
  scrollSearchList() {
    setTimeout(() => {
      $('html, body').animate({
          scrollTop: $('.topSec1').offset().top - 60
      }, 500);
    }, 1000);
  }


  /**
   * @func {{filterSearch}}
   * @description {{this will make the filter serach data}}
   */
  filterSearch() {
    const searchResult = this.searchData;
    this.data.musiciansSearch(searchResult);
    // alert();

    // search result scroll down
    this.scrollSearchList();
  }

  /**
   * @func {{removeFrmArr}}
   * @param \{{{any}}\} {{array}} {{pass the main array object}}
   * @param \{{{any}}\} {{element}} {{this will be the element that you want to remove}}
   */
  removeFrmArr(array, element) {
      return array.filter(e => e !== element);
  }

  /**
   * @func {{musicianFilter}}
   * @param \{{{any}}\} {{$data}} {{this will hold the single value}}
   * @param \{{{boolean}}\} {{$e}} {{check box status}}
   * @description {{this will filter the musicians data}}
   */
  musicianFilter($data, $e) {
    // console.log($data, $e.target.checked);
    if (Object.keys(this.searchData).length === 0 && this.searchData.constructor === Object) {
      if ($e.target.checked) {
        this.searchData.musicianType.push($data);
      } else {
        this.searchData.musicianType = this.removeFrmArr(this.searchData.musicianType, $data);
      }
    } else {
      if ($e.target.checked) {
        this.searchData.musicianType.push($data);
      } else {
        this.searchData.musicianType = this.removeFrmArr(this.searchData.musicianType, $data);
      }
    }
  }


  /**
   * @func {{instrumentFilter}}
   * @param \{{{any}}\} {{$data}} {{this will hold the single value}}
   * @param \{{{boolean}}\} {{$e}} {{check box status}}
   * @description {{this will filter the instrument data}}
   */
  instrumentFilter($data, $e) {
    // console.log($data, $e.target.checked);
    if (Object.keys(this.searchData).length === 0 && this.searchData.constructor === Object) {
      if ($e.target.checked) {
        this.searchData.instrument.push($data);
      } else {
        this.searchData.instrument = this.removeFrmArr(this.searchData.instrument, $data);
      }
    } else {
      if ($e.target.checked) {
        this.searchData.instrument.push($data);
      } else {
        this.searchData.instrument = this.removeFrmArr(this.searchData.instrument, $data);
      }
    }
  }

  /**
   * @func {{profStatusFilter}}
   * @param \{{{any}}\} {{$data}} {{this will hold the single value}}
   * @param \{{{boolean}}\} {{$e}} {{check box status}}
   * @description {{this will filter the proffesional status data}}
   */
  profStatusFilter($data, $e) {
    // console.log($data, $e.target.checked);
    if (Object.keys(this.searchData).length === 0 && this.searchData.constructor === Object) {
      if ($e.target.checked) {
        this.searchData.professional_status.push($data);
      } else {
        this.searchData.professional_status = this.removeFrmArr(this.searchData.professional_status, $data);
      }
    } else {
      if ($e.target.checked) {
        this.searchData.professional_status.push($data);
      } else {
        this.searchData.professional_status = this.removeFrmArr(this.searchData.professional_status, $data);
      }
    }
  }


  /**
   * @func {{genreFilter}}
   * @param \{{{any}}\} {{$data}} {{this will hold the single value}}
   * @param \{{{boolean}}\} {{$e}} {{check box status}}
   * @description {{this will filter the genre status data}}
   */
  genreFilter($data, $e) {
    // console.log($data, $e.target.checked);
    if (Object.keys(this.searchData).length === 0 && this.searchData.constructor === Object) {
      if ($e.target.checked) {
        this.searchData.genre.push($data);
      } else {
        this.searchData.genre = this.removeFrmArr(this.searchData.genre, $data);
      }
    } else {
      if ($e.target.checked) {
        this.searchData.genre.push($data);
      } else {
        this.searchData.genre = this.removeFrmArr(this.searchData.genre, $data);
      }
    }
  }



  /**
   * @func {{getAllProfessionaltype}}
   * @description {{this will fetch the all proffessional data}}
   */
  getAllProfessionaltype() {
    this.musiciansService.getAllprofessionaltype()
      .subscribe(
        (data: any) => {
          // console.log(data);
          this.pstatus = data.map(pstat => ({id: pstat.id * 1, itemName: pstat.name}));


          // jquery thing
          setTimeout(() => {
            // scroller added
            $('.scrollChklict').slimScroll({
                height: '100px',
                size: '3px',
                railOpacity: 0.1,
                alwaysVisible: true
            });

          }, 500);

        },
        error => {
          console.log(error);
          alert('Something went wrong in the countrylist');
        }
      );
  }


  /**
   * @func {{getAllGenre}}
   * @description {{this will fetch the all genre data}}
   */
  getAllGenre() {
    this.musiciansService.fetchMusicansgenre()
      .subscribe(
        (data: any) => {
          // console.log(data);
          this.genreList = data.map(gen => ({id: gen.id * 1, itemName: gen.name}));
          // p status
          this.getAllProfessionaltype();
        },
        error => {
          console.log(error);
          alert('Something went wrong in the countrylist');
        }
      );
  }

  /**
   * @func {{getAllInstruments}}
   * @description {{this will fetch the all instruments data}}
   */
  getAllInstruments() {
    this.musiciansService.getAllInstruments()
      .subscribe(
        (data: any) => {
          // console.log(data);
          this.instrumentList = data.map(ins => ({id: ins.id * 1, itemName: ins.name}));

          // genre list fetch
          this.getAllGenre();
        },
        error => {
          console.log(error);
          alert('Something went wrong in the countrylist');
        }
      );
  }

  /**
   * @func {{getAllMusiciansType}}
   * @description {{this will fetch the all musicians type data}}
   */
  getAllMusiciansType() {
    this.musiciansService.fetchMusicanstype()
      .subscribe(
        (data: any) => {
          // console.log(data);
          this.musiciansTypeList = data.map(type => ({id: type.musiciantype_id * 1, itemName: type.musiciantype_name}));
          // get all instruments
          this.getAllInstruments();
        },
        error => {
          console.log(error);
          alert('Something went wrong in the countrylist');
        }
      );
  }

  /**
   * @func {{getAllCountry}}
   * @description {{this will fetch the all country data}}
   */
  getAllCountry() {
    this.commonService.getCountry()
      .subscribe(
        (data: any) => {
          // console.log(data)
          this.allCountryList = data;
          // get all musicians type
          this.getAllMusiciansType();
        },
        error => {
          console.log(error);
          alert('Something went wrong in the countrylist');
        }
      );
  }


  /**
   * @func {{ngOnInit}}
   * @description {{Angular lifecycle hook}}
   */
  ngOnInit() {
    // subscribe the data service
    this.data.musiciansSearch('initial');
    this.data.currentSearch.subscribe(search => this.searchData = search);
    // make the blank object
    if (this.searchData == 'initial') {
      this.searchData = {};
      this.searchData.musicianType = [];
      this.searchData.instrument = [];
      this.searchData.professional_status = [];
      this.searchData.genre = [];
      this.searchData.country = '';
    }


    // get all country data and after that more data come by caining
    this.getAllCountry();



    // toggler added
    $("body").on("click",".filterBox h3", function(){
      if(!$(this).next(".slimScrollDiv .collapseCont").is(":visible")){		
        $(this).next(".slimScrollDiv .collapseCont").slideDown(400);
        $(this).removeClass("off");
      } else {
        $(this).next(".slimScrollDiv .collapseCont").slideUp(400);
        $(this).addClass("off");
      }
    });
    


  }

}

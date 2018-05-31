import { Component, OnInit } from "@angular/core";
import { UserService } from "../../_services/user.service";

import {IMyDrpOptions} from 'mydaterangepicker';

// for jquery
declare var $: any;
declare var Morris: any;
declare var moment: any;

@Component({
  selector: "app-user-staistic",
  templateUrl: "./user-staistic.component.html",
  styleUrls: ["./user-staistic.component.css"]
})
export class UserStaisticComponent implements OnInit {
  authUser: any;
  /**
   * @property \{{{any}}\} {{tourlist}} {{this will hold the all tourlist}}
   */
  tourlist: any = [];
  /**
   * @property \{{{any}}\} {{tourlist}} {{this will hold the all tourlist}}
   */
  tourlistFull: any = [];
  /**
   * @property \{{{any}}\} {{openDateRange}} {{this will make the open the date range}}
   */
  openDateRange: any = false;
  /**
   * @property \{{{any}}\} {{filterDate}} {{this will filter data value}}
   */
  filterDate: any = '';
  /**
   * @property \{{{any}}\} {{_dateRange}} {{this will hold the custom date date model}}
   */
  _dateRange = ['', ''];
  frmdate: any = 0;
  todate: any = 0;
  /**
   * @property \{{{type}}\} {{name}} {{description}}{{}}
   */
  tourId: any = '';

  myDateRangePickerOptions: IMyDrpOptions = {
      // other options...
      dateFormat: 'dd.mm.yyyy',
  };

  model: any = {
    beginDate: '',
    endDate: '',
  };
  noAccess: any = false;


  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private userService: UserService,
  ) {}


  clicCalender(){
    $('.btnpickerenabled')[0].click();
  }

  clearClick(){
    $('.headerclearbtnenabled')[0].click();
  }



  /**
   * @func {{filterDateRange}}
   * @description {{This will search the date as per given value}}
   */
  filterDateRange() {
    if (this.filterDate == 'C') {
      this.openDateRange = true;

      const filterdayblank = '';

      this.getTotalShare(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterdayblank);
      this.getTopCountry(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterdayblank);
      this.getAllTotalTourViewPerDay(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterdayblank);
      this.getRowTimeSpan(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterdayblank);

    } else {
      this.openDateRange = false;
      // this._dateRange = [null, null];

      // alert(this.filterDate)
      this.getTotalShare(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
      this.getTopCountry(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
      this.getAllTotalTourViewPerDay(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
      this.getRowTimeSpan(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
    }
  }


  filterTourRange($event) {
    // console.log($event.target.value);
    this.tourId = $event.target.value;

    this.getTotalShare(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
    this.getTopCountry(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
    this.getAllTotalTourViewPerDay(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
    this.getRowTimeSpan(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
  }




  onDateRangeChanged(event) {
    // console.log(event, event.beginJsDate == null)
    if(event.beginJsDate == null && event.endJsDate == null){
      this.filterDate = '';
      this.openDateRange = false;
    }
    // date range check is grater then current date
    if (event.beginJsDate != null && event.endJsDate != null){
      const frmdate = `${event.beginDate.year}-${event.beginDate.month}-${event.beginDate.day}`;
      const todate = `${event.endDate.year}-${event.endDate.month}-${event.endDate.day}`;

      const now = moment.now();

      const frmdateTimeStamp = +new Date(moment(frmdate).format());
      const todateTimeStamp = +new Date(moment(todate).format());

      // console.log(frmdate, todate);
      // console.log(frmdateTimeStamp, todateTimeStamp);
      if (frmdateTimeStamp > now || todateTimeStamp > now){
        alert('Select valid date range');
        return false;
      }
    }





    let filterday;
    if (this.filterDate == 'C') {
      filterday = '';
    } else {
      filterday = this.filterDate;
    }

    if(event == undefined){
      if(this.frmdate == 0 && this.todate == 0){
        this.frmdate = 0;
        this.todate = 0;
      }
      // api call
      this.getTotalShare(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      this.getTopCountry(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      this.getAllTotalTourViewPerDay(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      this.getRowTimeSpan(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
    } else {
      this.frmdate = `${event.beginDate.year}-${event.beginDate.month}-${event.beginDate.day}`;
      this.todate = `${event.endDate.year}-${event.endDate.month}-${event.endDate.day}`;

      // api call
      this.getTotalShare(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      this.getTopCountry(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      this.getAllTotalTourViewPerDay(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      this.getRowTimeSpan(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
    }
  }






  /**
   * @func {{totalViewPerDay}}
   * @param $data pass the chart data
   * @description {{this method will draw the tour view chart}}
   */
  totalViewPerDay($data) {
    Morris.Line({
      // ID of the element in which to draw the chart.
      element: 'myfirstchart',
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      // data: [
      //   { day: 'Monday', pushups: 20, beers: 2 },
      //   { day: 'Tuesday', pushups: 10, beers: 2 },
      //   { day: 'Wednesday', pushups: 5, beers: 3 },
      //   { day: 'Thursday', pushups: 5, beers: 4 },
      //   { day: 'Friday', pushups: 20, beers: 1 }
      // ],
      data: $data,
      // The name of the data record attribute that contains x-values.
      xkey: 'day',
      parseTime: false,
      // A list of names of data record attributes that contain y-values.
      ykeys: ['views'],
      // Labels for the ykeys -- will be displayed when you hover over the
      // chart.
      labels: ['Views'],
      lineColors: ['#E65A26']
    });
  }


  /**
   * @func {{getAllTotalTourViewPerDay}}
   * @param token this will pass the auth user token
   * @param tour pass the tour id
   * @param frmdate from date filter
   * @param todate todate filter
   * @param days this will pass the selected days
   * @description {{this will fetch data for the total tour view chart}}
   */
  getAllTotalTourViewPerDay(token, tour, frmdate, todate, days) {
    this.userService.totalTourViewPerDay(token, tour, frmdate, todate, days)
      .subscribe(
        (viewdata: any) => {
          const mapedData = viewdata.data.map(s => ({day: s.y, views: s.a}));

          // console.log(mapedData);

           // make the empty the graph and redraw
          $('#myfirstchart').empty();
          this.totalViewPerDay(mapedData);
        },
        err => {
          console.log(err);
        }
      );
  }





  /**
   * @func {{topCountry}}
   * @description {{This will create the country data chart}}
   */
  topCountry($data) {
    Morris.Donut({
      element: 'hero-donut',
      data: $data,
      formatter: function (y) { return y + "%" }
    });
  }

  /**
   * @func {{getTopCountry}}
   * @param token this will pass the auth user token
   * @param tour pass the tour id
   * @param frmdate from date filter
   * @param todate todate filter
   * @description {{This will fetch the country data}}
   */
  getTopCountry(token, tour, frmdate, todate, days) {

    const localobj = {
      api_token: token,
      tour: tour,
      from_date: frmdate,
      to_date: todate,
      days: days
    };

    this.userService.viewTourCountry(localobj)
      .subscribe(
        dataset => {
          // console.log(dataset.response.data);
          // modify the data as per graph
          const countrydata = dataset.response.data.map(c => ({label: c.country_name, value: c.percent}))

          // make the empty the graph and redraw
          $('#hero-donut').empty();
          this.topCountry(countrydata);
        },
        error => {
          console.log(error);
        }
      );
  }




  /**
   * @func {{whichDevice}}
   * @param $data pass the chart data
   * @description {{this method will draw the chart}}
   */
  whichDevice($data) {
    Morris.Donut({
      element: 'hero-donut2',
      data: $data,
      formatter: function (y) { return y + "%" }
    });
  }

  /**
   * @func {{getWhichDevice}}
   * @param token this will pass the auth user token
   * @param tour pass the tour id
   * @param frmdate from date filter
   * @param todate todate filter
   * @description {{this will fetch data data for the device chart}}
   */
  getWhichDevice(token, tour, frmdate, todate) {
    this.userService.viewTourDevice(token, tour, frmdate, todate)
      .subscribe(
        dataset => {
          // console.log(dataset.response.data);
          // modify the data as per graph
          const deviceData = [
            {label: 'Desktop', value: dataset.response.data.computerPercent},
            {label: 'Mobile', value: dataset.response.data.mobilePercent}
          ];

          // make the empty the graph and redraw
          $('#hero-donut2').empty();
          this.whichDevice(deviceData);
        },
        error => {
          console.log(error);
        }
      );
  }





  /**
   * @func {{totalShare}}
   * @param $data pass the chart data
   * @description {{this method will draw the share chart}}
   */
  totalShare($data){
    Morris.Line({
      // ID of the element in which to draw the chart.
      element: 'pushups',
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      // data: [
        // { day: 'Monday', pushups: 20, beers: 2 },
        // { day: 'Tuesday', pushups: 10, beers: 2 },
        // { day: 'Wednesday', pushups: 5, beers: 3 },
        // { day: 'Thursday', pushups: 5, beers: 4 },
        // { day: 'Friday', pushups: 20, beers: 1 }
      // ],
      data: $data,
      // The name of the data record attribute that contains x-values.
      xkey: 'day',
      parseTime: false,
      // A list of names of data record attributes that contain y-values.
      ykeys: ['shares'],
      // Labels for the ykeys -- will be displayed when you hover over the
      // chart.
      labels: ['Shares'],
      lineColors: ['#373651','#E65A26']
    });
  }


   /**
   * @func {{getTotalShare}}
   * @param token this will pass the auth user token
   * @param tour pass the tour id
   * @param frmdate from date filter
   * @param todate todate filter
   * @param days this will pass the selected days
   * @description {{this will fetch data for the total share chart}}
   */
  getTotalShare(token, tour, frmdate, todate, days){

    const localobj = {
      api_token: token,
      tour: tour,
      from_date: frmdate,
      to_date: todate,
      days: days
    }

    this.userService.totalShare(localobj)
      .subscribe(
        (sharedata: any) => {
          const mapedData = sharedata.data.map(s => ({day: s.y, shares: s.a}));

           // make the empty the graph and redraw
          $('#pushups').empty();
          this.totalShare(mapedData);
        },
        err => {
          console.log(err);
        }
      );
  }




  // avgTimeSpanTour($data){
  //   Morris.Line({
  //     // ID of the element in which to draw the chart.
  //     element: 'pushups2',
  //     // Chart data records -- each entry in this array corresponds to a point on
  //     // the chart.
  //     data: [
  //       { day: '1', pushups: 20, beers: 2 },
  //       { day: '2', pushups: 10, beers: 2 },
  //       { day: '3', pushups: 5, beers: 3 },
  //       { day: '4', pushups: 5, beers: 4 },
  //       { day: '5', pushups: 20, beers: 1 },
  //       { day: '6', pushups: 20, beers: 2 },
  //       { day: '7', pushups: 10, beers: 2 },
  //       { day: '8', pushups: 5, beers: 3 },
  //       { day: '9', pushups: 5, beers: 4 },
  //       { day: '10', pushups: 20, beers: 1 },
  //       { day: '11', pushups: 20, beers: 2 },
  //       { day: '12', pushups: 10, beers: 2 },
  //       { day: '13', pushups: 5, beers: 3 },
  //       { day: '14', pushups: 5, beers: 4 },
  //       { day: '15', pushups: 20, beers: 1 },
  //       { day: '16', pushups: 20, beers: 2 },
  //       { day: '17', pushups: 10, beers: 2 },
  //       { day: '18', pushups: 5, beers: 3 },
  //       { day: '19', pushups: 5, beers: 4 },
  //       { day: '20', pushups: 20, beers: 1 },
  //       { day: '21', pushups: 20, beers: 2 },
  //       { day: '22', pushups: 10, beers: 2 },
  //       { day: '23', pushups: 5, beers: 3 },
  //       { day: '24', pushups: 5, beers: 4 },
  //       { day: '25', pushups: 20, beers: 1 },
  //       { day: '26', pushups: 20, beers: 2 },
  //       { day: '27', pushups: 10, beers: 2 },
  //       { day: '28', pushups: 5, beers: 3 },
  //       { day: '29', pushups: 5, beers: 4 },
  //       { day: '30', pushups: 20, beers: 1 }
  //     ],
  //     // The name of the data record attribute that contains x-values.
  //     xkey: 'day',
  //     parseTime: false,
  //     // A list of names of data record attributes that contain y-values.
  //     ykeys: ['pushups','beers'],
  //     // Labels for the ykeys -- will be displayed when you hover over the
  //     // chart.
  //     labels: ['Pushups','Beers'],
  //     lineColors: ['#373651','#E65A26']
  //   });
  // }




  /**
   * @func {{topTours}}
   * @description {{this will generate the graph}}
   */
  topTours($data) {
    Morris.Bar({
      element: 'toptours',
      // data: [
      //   { y: 'tour-1', a: 75 },
      //   { y: 'tour-2', a: 100 },
      //   { y: 'tour-3', a: 258 },
      //   { y: 'tour-4', a: 75 },
      //   { y: 'tour-5', a: 100 },
      // ],
      data: $data,
      xkey: 'y',
      axes: false,
      ykeys: ['a'],
      labels: ['Total Views'],
      pointSize: 2,
      hideHover: 'auto'
    });
  }

  /**
   * @func {{getTopTours}}
   * @description {{this get the top tours}}
   */
  getTopTours(token) {
    this.userService.viewTopTours(token)
      .subscribe(
        (tdata: any) => {
          // console.log(tdata.response.data);

          const chartData = tdata.response.data.map(t => ({y: t.title == '' ? 'No title set': t.title, a: t.viewcount}));

          $('#toptours').empty();
          this.topTours(chartData);

        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }








  /**
   * @func {{graphgenerate}}
   * @param maindata this will get the main data
   * @param ykey this will get the ykey array
   * @param label this will set the label array
   * @description {{this will generate the timespan graph}}
   */
  graphgenerate(maindata, ykey, label){
    console.log(maindata);
    Morris.Line({
      // ID of the element in which to draw the chart.
      element: 'pushups2',
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      data: maindata,
      // The name of the data record attribute that contains x-values.
      xkey: 'day',
      parseTime: false,
      // A list of names of data record attributes that contain y-values.
      ykeys: ykey,
      // Labels for the ykeys -- will be displayed when you hover over the
      // chart.
      labels: label,
    });
  }


  /**
   * @func {{getRowTimeSpan}}
   * @param token auth token data
   * @param tour tour id
   * @param frmdate from date filter
   * @param todate to date filter
   * @param days days filter
   * @description {{this will get the remote data and make the graph}}
   */
  getRowTimeSpan(token, tour, frmdate, todate, days) {
    // main graph array
    const graphArr = [];
    // fetch the timespan row data
    this.userService.totalTourAvgTimeSpan(token, tour, frmdate, todate, days)
      .subscribe(
        (tspData: any) => {
          const maindata = tspData.data;

          // row data maping
          maindata.map((a, i) => {
            // console.log(a, i+1)
            let createobj = {day: i + 1 };
            let innerdata = a.tourview;
            innerdata.map((b, j) => {
              let filterdata = this.tourlist.filter(t => t.tourid == b.id);
              let tourname = filterdata[0].title == '' ? 'No title set' : filterdata[0].title;
              // createobj.filterdata[0].title
              // total
              // console.log(tourname,b.du)
              // createobj.duration = createobj.duration + b.du
              createobj[tourname] = 0 + b.du;
            })
            // console.log(createobj)
            graphArr.push(createobj);
          });
          // console.log(graphArr);

          // ******
          // title case function
          // ******
          function toTitleCase(str){
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          }

          // make the yAxis and graphlabel array
          const yAxixArry = [];
          const graphLabel = [];
          // ******
          // api call for all tour list
          // ******
          this.userService.statTourList(token)
          .subscribe(
            dataset => {
              const tourlist = dataset.response.data.map(at => ({tourid: at.tourid, title: at.title}));

              tspData.dataarr.map((a, i) => {
                const singletour = tourlist.filter(t => t.tourid == a);
                yAxixArry.push(singletour[0].title == '' ? 'No title set' : singletour[0].title);
                graphLabel.push(singletour[0].title == '' ? 'No Title Set' : toTitleCase(singletour[0].title));
              });
              // console.log(yAxixArry, graphLabel);
              // console.log(graphArr);

              // graph generate
              $('#pushups2').empty();
              this.graphgenerate(graphArr, yAxixArry, graphLabel);
            },
            error => {
              console.log(error);
              // alert('Something went wrong!');
            }
          );
        },
        err => {
          console.log(err);
        }
      );
  }






  /**
   * @func {{getAlltourList}}
   * @param \{{{any}}\} {{$token}} {{this will take the token}}
   * @description {{this will get all tourlist}}
   */
  getAlltourList($token) {
    // api call
    this.userService.statTourList($token)
      .subscribe(
        dataset => {
          this.tourlist = dataset.response.data;


          // call the time span graph






        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }




  ngOnInit() {
    // set the auth user and store the data in the localstorage
    this.authUser = this.userService.getAuthUser();


    if (this.authUser.SubscriptionFeture.includes(2) != true) {
      this.noAccess = true;
    }


    // if is pre selected tour id
    if (localStorage.getItem('vt_TourID') != null && localStorage.getItem('vt_TourID') != '' ) {
      this.tourId = localStorage.getItem('vt_TourID');
      localStorage.removeItem('vt_TourID');
    }


    // get all tourlist
    this.getAlltourList(this.authUser.api_token);

    // total view per day
    // this.totalViewPerDay();
    this.getAllTotalTourViewPerDay(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);

    // top country
    // this.topCountry();
    this.getTopCountry(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);

    // which device
    // this.whichDevice();
    this.getWhichDevice(this.authUser.api_token, this.tourId, this._dateRange[0], this._dateRange[1]);

    // top tours
    // this.topTours();
    this.getTopTours(this.authUser.api_token);

    // total share
    // this.totalShare();
    this.getTotalShare(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate)

    // time span tour
    // this.avgTimeSpanTour();

    this.getRowTimeSpan(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);


    



  }
}

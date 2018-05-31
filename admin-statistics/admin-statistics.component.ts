import { Component, OnInit } from "@angular/core";
// import { UserService } from "../../_services/user.service";
import { AdminService } from "../../_services/admin.service";


// for jquery
declare var $: any;
declare var moment: any;
declare var Morris: any;


@Component({
  selector: "app-admin-statistics",
  templateUrl: "./admin-statistics.component.html",
  styleUrls: ["./admin-statistics.component.css"]
})
export class AdminStatisticsComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{toursData}} {{this will hold the all tours data}}
   */
  toursData: any = [];
  /**
   * @property \{{{any}}\} {{activeInavtive}} {{This will hold the active inactive client data}}
   */
  activeInavtive: any = [];
  /**
   * @property \{{{any}}\} {{revenueStat}} {{this will give you the all revenue data}}
   */
  revenueStat: any = [];
  /**
   * @property \{{{any}}\} {{allOrgData}} {{this will hold the all organaization data}}
   */
  allOrgData: any = [];
  /**
   * @property \{{{any}}\} {{singleOrg}} {{store the single id}}
   */
  singleOrg: any = '';
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
  _dateRange = [null, null];

  frmdate: any = 0;
  todate: any = 0;

  model: any = {
    beginDate: '',
    endDate: '',
  };




  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private adminService: AdminService
  ) {}


  clicCalender(){
    $('.btnpickerenabled')[0].click();
  }



  /**
   * @func {{filterDateRange}}
   * @description {{This will search the date as per given value}}
   */
  filterDateRange() {
    console.log(this.filterDate)
    if (this.filterDate == 'C') {
      this.openDateRange = true;

      const filterdayblank = '';

      this.getCountryData(this.frmdate, this.todate, this.filterDate);
      // this.getSubscriptionData(this.singleOrg, this.frmdate, this.todate, this.filterDate);

      // this.getTotalShare(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterdayblank);
      // this.getTopCountry(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterdayblank);
      // this.getAllTotalTourViewPerDay(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterdayblank);
      // this.getRowTimeSpan(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterdayblank);

    } else {
      this.openDateRange = false;
      // this._dateRange = [null, null];

      this.getCountryData(this.frmdate, this.todate, this.filterDate);
      this.getSubscriptionData(this.singleOrg, this.frmdate, this.todate, this.filterDate);
      this.getRevenueData(this.singleOrg, this.frmdate, this.todate, this.filterDate);

      // alert(this.filterDate)
      // this.getTotalShare(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
      // this.getTopCountry(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
      // this.getAllTotalTourViewPerDay(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
      // this.getRowTimeSpan(this.authUser.api_token, this.tourId, this.frmdate, this.todate, this.filterDate);
    }
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

    if (event == undefined) {
      if(this.frmdate == 0 && this.todate == 0){
        this.frmdate = 0;
        this.todate = 0;
      }

      // console.log(this.frmdate, this.todate)

      this.getCountryData(this.frmdate, this.todate, this.filterDate);
      this.getSubscriptionData(this.singleOrg, this.frmdate, this.todate, this.filterDate);
      this.getRevenueData(this.singleOrg, this.frmdate, this.todate, this.filterDate);

      // api call
      // this.getTotalShare(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      // this.getTopCountry(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      // this.getAllTotalTourViewPerDay(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      // this.getRowTimeSpan(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
    } else {
      this.frmdate = `${event.beginDate.year}-${event.beginDate.month}-${event.beginDate.day}`;
      this.todate = `${event.endDate.year}-${event.endDate.month}-${event.endDate.day}`;

      // console.log(this.frmdate, this.todate)

      this.getCountryData(this.frmdate, this.todate, this.filterDate);
      this.getSubscriptionData(this.singleOrg, this.frmdate, this.todate, this.filterDate);
      this.getRevenueData(this.singleOrg, this.frmdate, this.todate, this.filterDate);

      // api call
      // this.getTotalShare(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      // this.getTopCountry(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      // this.getAllTotalTourViewPerDay(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
      // this.getRowTimeSpan(this.authUser.api_token, this.tourId, this.frmdate, this.todate, filterday);
    }
  }



  selectOrg($data) {
    // generate country data as per graph
    this.getCountryData(this.frmdate, this.todate, this.filterDate);
    
    // this.getRevenueData(this.singleOrg, this.frmdate, this.todate, this.filterDate);
    // revenue chart draw as per revenue data
    this.getRevenueData(this.singleOrg, this.frmdate, this.todate, this.filterDate);

    // draw subscription chart as per subscription data
    this.getSubscriptionData(this.singleOrg, this.frmdate, this.todate, this.filterDate);

    // get all tours data as per org choose
    this.getAllToursStat(this.singleOrg);

    


  }






  /**
   * @func {{getAllOrganaization}}
   * @description {{this will fetch all the org}}
   */
  getAllOrganaization($lang) {
    this.adminService.getAllOrgData($lang)
      .subscribe(
        data => {
          this.allOrgData = data;
        },
        err => {
          console.log(err);
          alert('Something went wrong!');
        }
      );
  }



  /**
   * @func {{getAllToursStat}}
   * @description {{this will fetch all the tours statistic}}
   */
  getAllToursStat($orgid) {
    this.adminService.getToursAreaDetails($orgid)
      .subscribe(
        data => {
          this.toursData = data.response;
        },
        err => {
          console.log(err);
          alert('Something went wrong!');
        }
      );
  }


  /**
   * @func {{getAllActiveInactive}}
   * @description {{This will fetch all the active inactive user data from the server}}
   */
  getAllActiveInactive() {
    this.adminService.getActiveInactiveClient()
      .subscribe(
        data => {
          this.activeInavtive = data.response;
        },
        err => {
          console.log(err);
          alert('Something went wrong!');
        }
      );
  }


  /**
   * @func {{subscriptionChart}}
   * @description {{create the subscription chart}}
   */
  subscriptionChart($data) {
    Morris.Line({
      // ID of the element in which to draw the chart.
      element: 'myfirstchart',
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      data: $data,
      // The name of the data record attribute that contains x-values.
      xkey: 'day',
      parseTime: false,
      // A list of names of data record attributes that contain y-values.
      ykeys: ['subscription'],
      // Labels for the ykeys -- will be displayed when you hover over the
      // chart.
      labels: ['Subscription'],
      lineColors: ['#373651', '#E65A26']
    });
  }


  /**
   * @func {{getSubscriptionData}}
   * @description {{this will fetch all the subscription data}}
   */
  getSubscriptionData($orgid, $frmdate, $todate, $days) {


    // service call
    this.adminService.getAllRevenue($orgid, $frmdate, $todate, $days)
      .subscribe(
        mdata => {
          // original response
          this.revenueStat = mdata;

          // first empty the area then appare the graph
          $('#myfirstchart').empty();
          this.subscriptionChart(this.revenueStat.data);
        },
        err => {
          console.log(err);
          alert('Something went wrong!');
        }
      );

  }



  /**
   * @func {{revenueChart}}
   * @param \{{{any}}\} {{$data}} {{pass the all data from here}}
   * @description {{this will draw the chart as per revenue}}
   */
  revenueChart($data) {
    Morris.Line({
      // ID of the element in which to draw the chart.
      element: 'pushups',
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      data: $data,
      // The name of the data record attribute that contains x-values.
      xkey: 'day',
      parseTime: false,
      // A list of names of data record attributes that contain y-values.
      ykeys: ['stripe', 'paypal'],
      // Labels for the ykeys -- will be displayed when you hover over the
      // chart.
      labels: ['Stripe', 'Paypal'],
      lineColors: ['#373651', '#E65A26']
    });
  }



  /**
   * @func {{getRevenueData}}
   * @description {{this will fetch all the revenue data}}
   */
  getRevenueData($orgid, $frmdate, $todate, $days) {
    

    // service call
    this.adminService.admin_revenueGraph($orgid, $frmdate, $todate, $days)
      .subscribe(
        mdata => {
          // original response
          // this.revenueStat = data.response;


        // console.log(gdata)

          // first empty the area then appare the graph
          $('#pushups').empty();
          this.revenueChart(mdata.data);
        },
        err => {
          console.log(err);
          alert('Something went wrong!');
        }
      );

  }




  /**
   * @func {{countryChart}}
   * @param \{{{any}}\} {{$data}} {{pass the all data from here}}
   * @description {{this will draw the chart as per country}}
   */
  countryChart($data) {
    Morris.Donut({
      element: 'hero-donut',
      data: $data,
      formatter: function(y) {
        return y + '%';
      }
    });
  }


  /**
   * @func {{getCountryData}}
   * @description {{this will fetch all the country data}}
   */
  getCountryData($frmdata, $todate, $days) {
    // get all country data
    this.adminService.getAllCountryData($frmdata, $todate, $days)
      .subscribe(
        data => {
          const countryData = data.country;
          const mappedData = countryData.map(c => ({label: c.country_name, value: c.count}));
          // generate graph
          $('#hero-donut').empty();
          this.countryChart(mappedData);

        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );


  }




  



  ngOnInit() {
    // get all org
    this.getAllOrganaization('en');

    // draw subscription chart
    // this.subscriptionChart();
    this.getSubscriptionData(this.singleOrg, this.frmdate, this.todate, this.filterDate);

    // country chart draw
    // this.countryChart();
    this.getCountryData(this.frmdate, this.todate, this.filterDate);

    // revenue chart draw
    // this.revenueChart();
    this.getRevenueData(this.singleOrg, this.frmdate, this.todate, this.filterDate);

    const dummy = '';

    // get all tours
    this.getAllToursStat(dummy);

    // get all active and inactive user
    this.getAllActiveInactive();




  }
}

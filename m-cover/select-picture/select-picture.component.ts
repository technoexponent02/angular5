import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { DomSanitizer } from '@angular/platform-browser'

import { AuthServices } from '../../../../_services/auth.service';
import { HeaderCoverServices } from '../../../../_services/header-cover.service';
import { CommonService } from '../../../../_services/common.service';


declare var $: any;
declare var moment: any;
declare var Cropper: any;

@Component({
  selector: 'mcover-select-picture',
  templateUrl: './select-picture.component.html',
  styleUrls: ['./select-picture.component.css']
})
export class SelectPictureComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{authUser}} {{this will set the auth user data}}
   */
  authUser: any;
  /**
   * @description {{'setImage' data get the name which image is uploading}}
   */
  @Input() setImage: any;
  /**
   * @property \{{{any}}\} {{uploadedImageData}} {{form model}}
   */
  uploadedImageData: any = {
    showComponentStatus: false,
    uploaded: '',
    whichImage: '',
    imagesource: {},
    title: '',
    year: '',
    details: '',
    picturealbun: [],
    originalPicId: '',
    picStatus: '',
    originalPicSrc: ''
  };
  /**
   * @property \{{{any}}\} {{imageTermsCheck}} {{this will image terms check}}
   */
  imageTermsCheck: any = false;


  /**
   * @description {{this will be the album item list}}
   */
  itemList: any = [];
  /**
   * @description {{this will hold the setting for the angular 2 multiselect plugin}}
   */
  settings = {};
  /**
   * @property \{{{any}}\} {{yearList}} {{this will hold the yearlist data}}
   */
  yearList: any = [];
  /**
   * @property \{{{any}}\} {{imageThumbList}} {{this will hold the imageThumbList data}}
   */
  imageThumbList: any = [];
  /**
   * @property \{{{any}}\} {{imageThumbShow}} {{this will show the image thumb list}}
   */
  // imageThumbShow: any = false;

  showcrop: boolean = false;

  /**
   * @property \{{{boolean}}\} {{cropareaTitleState}} {{this will be the change the text according}}
   */
  cropareaTitleState: boolean = false;
  /**
   * @property \{{{boolean}}\} {{cropareaTitleState}} {{this will be the change the text according}}
   */
  changeFormState: boolean = true;

  loadmore: any = 2;
  hideLoadMore: any = true;




  /**
   * @description {{'uploadedImageDataEvent' this will emit the data to the parent}}
   */
  @Output() uploadedImageDataEvent = new EventEmitter<string>();

  /**
   * @property \{{{any}}\} {{uploadimage}} {{this will be the upload image preview state}}
   */
  uploadimage: any = false;

  /**
   * @description {{cropper settings and all}}
   */
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  cropperSettings: CropperSettings;




  /**
   * @constructor
   * @description {{DI will pushed here}}
   */
  constructor(
    private authServices: AuthServices,
    private headerCoverServices: HeaderCoverServices,
    private commonService: CommonService,
    private snitize: DomSanitizer
  ) {
    // default cropper settings
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    // this.cropperSettings.allowedFilesRegex = RegExp(/.(jpe?g|png|gif)$/i);

    this.cropperSettings.width = 500;
    this.cropperSettings.height = 300;
    this.cropperSettings.croppedWidth = 500;
    this.cropperSettings.croppedHeight = 300;
    this.cropperSettings.canvasWidth = 602;
    this.cropperSettings.canvasHeight = 304;
  }



  loadMoreThumb(){
    // make local object
    const localObj = {
      'api_token': this.authUser.token,
      'image_for': this.authUser.uid,
      'type': 1, // type 1 is for user profile header image
      'page_no': this.loadmore++,
      'perpage': 6
    };

    // api call
    this.headerCoverServices.getAlbumThumb(localObj)
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 0) {
            // this.imageThumbList = data.images;

            for (let i = 0; i < data.images.length; i++) {
              this.imageThumbList.push(data.images[i]);
            }

            console.log(this.imageThumbList.length, data.totalImages)
            // load more hide
            if(data.totalImages <= this.imageThumbList.length){
              this.hideLoadMore = false;
            }

            // this.imageThumbShow = true;
            $(document).find('.uploadGalleryPopupBody').removeClass('loading-added');
          }
          if (data.status == 1) {
            alert(data.message);
            $(document).find('.uploadGalleryPopupBody').removeClass('loading-added');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
          $(document).find('.uploadGalleryPopupBody').removeClass('loading-added');
        }
      );


  }




  /**
   * @func {{sendUpdatedData}}
   * @description {{make api call and send the data via emit to parent component}}
   */
  sendUpdatedData(myform) {
    // first check the image source object blank or not then submit
    if (this.commonService.isEmptyObj(this.uploadedImageData.imagesource) === false) {
      this.uploadedImageData.uploaded = 'uploaded image';
      this.uploadedImageDataEvent.emit(this.uploadedImageData);
    } else {
      $(document).find('#imageReq').show();
    }
  }




  /**
   * @func {{backToTemplate}}
   * @description {{just send the template state}}
   */
  backToTemplate() {
    this.uploadedImageData.imagesource = {};
    this.uploadedImageDataEvent.emit(this.uploadedImageData);
  }


  /**
   * @func {{getAllPicAlbum}}
   * @description {{this will get all pic album}}
   */
  getAllPicAlbum() {
    this.headerCoverServices.getAlbumName()
      .subscribe(
        (data: any) => {
          // console.log(data);
          if (data.status == 0) {
            this.itemList = data.album_names;
          }
          if (data.status == 1) {
            alert(data.message);
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong with album list');
        }
      );
  }


  /**
   * @func {{getYearList}}
   * @param \{{{any}}\} {{$from}} {{put the from year}}
   * @param \{{{any}}\} {{$to}} {{put the to year}}
   * @desc {{this will get the full yearlist from the server}}
   */
  getYearList($from, $to) {
    this.commonService.getYearList($from, $to)
      .subscribe(
        (data: any) => {
          if (data.status == 1) {
            this.yearList = data.years;
          }
          if (data.status == 0) {
            alert(data.message);
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
        }
      );
  }

  /**
   * @func {{getAlbumList}}
   * @desc {{this will get all the album data}}
   */
  getAlbumList($pagenumber) {
    // make local object
    const localObj = {
      'api_token': this.authUser.token,
      'image_for': this.authUser.uid,
      'type': 1, // type 1 is for user profile header image
      'page_no': $pagenumber,
      'perpage': 6
    };

    // api call
    this.headerCoverServices.getAlbumThumb(localObj)
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 0) {
            // load more chk
            if(data.totalImages > 6){
              this.hideLoadMore = true;
            } else {
              this.hideLoadMore = false;
            }
            this.imageThumbList = data.images;
            // this.imageThumbShow = true;
            $(document).find('.uploadGalleryPopupBody').removeClass('loading-added');
          }
          if (data.status == 1) {
            alert(data.message);
            $(document).find('.uploadGalleryPopupBody').removeClass('loading-added');
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong!');
          $(document).find('.uploadGalleryPopupBody').removeClass('loading-added');
        }
      );
  }



  /**
   * @func {{ngOnInit}}
   * @description {{Lifecycle hook}}
   */
  ngOnInit() {
    // loader area
    $(document).find('.uploadGalleryPopupBody').addClass('loading-added');

    // get authuser data
    this.authUser = this.authServices.getAuthUser();


    // set the which image is uploaded
    this.uploadedImageData.whichImage = this.setImage.status;

    // set cropper width height as per value come
    this.cropperSettings.width = this.setImage.width;
    this.cropperSettings.height = this.setImage.height;
    this.cropperSettings.croppedWidth = this.setImage.width;
    this.cropperSettings.croppedHeight = this.setImage.height;


    // add class select pic
    $(document).find('.profileBannerCover').addClass('selectPicturePop');



    // api related things
    // het all pic album list
    this.getAllPicAlbum();
    // get yearlist
    this.getYearList(1901, moment().year());
    // thumb image
    this.getAlbumList(1);



    // multiselect settings
    this.settings = {
        text: 'Select Picture Album Tag',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'ng-multiselect ins-multi',
        maxHeight: 100
    };


  }





  // file to base64
  getBase64(file) {
      return new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function() { resolve(reader.result); };
          reader.onerror = reject;
          reader.readAsDataURL(file);
      });
  }

  // upload image
  readURL($event) {
    // hide the form and make the accetp check box true
    this.changeFormState = true;
    this.imageTermsCheck = false;
    // cropper change title
    this.cropareaTitleState = true;
    // show hide state cropper area
    this.showcrop = true;
    // start dom manipulation
    $(document).find('#blah').attr('src', '');
    let file = $event.target.files[0];

    // console.log(file)
    if (file.type == 'image/gif') {
      alert('Not supported file type.');
      return;
    }
    if (file.type == 'image/tiff') {
      alert('Not supported file type.');
      return;
    }


    let promise = this.getBase64(file);
    var that = this;
    promise.then(function(result) {
      $(document).find('#blah').attr('src', result);

      // making state
      that.uploadedImageData.originalPicSrc = result;
      that.uploadedImageData.originalPicId = '';
      that.uploadedImageData.picStatus = 'N';

      setTimeout(() => {
        // init the cropperjs
        that.initCropper();
      }, 500);
    });
  }

  // cropper js functionality
  initCropper(){
      // console.log("Came here", document.getElementById('blah'))
      var that = this;
      let image = document.getElementById('blah');
      // create the cropper obj
      let cropper = new Cropper(image, {});
      // destroy the cropper for the new image
      cropper.destroy();
      $('.cropper-container').remove();

      // get the data height and width
      let dataSettingWidth = this.cropperSettings.width;
      let dataSettingHeight = this.cropperSettings.height;

      // re init the cropper with valid settings
      cropper = new Cropper(image, {
        aspectRatio: dataSettingWidth / dataSettingHeight,
        minCropBoxWidth: dataSettingWidth,
        minCropBoxHeight: dataSettingHeight,
        crop: function(e) {
          let croppeddata = cropper.getCroppedCanvas({
            width: dataSettingWidth,
            heigth: dataSettingHeight,
          }).toDataURL();
          that.uploadedImageData.imagesource.image = croppeddata;
        }
      });

  }


  /**
   * @func {{baseToFileCrop}}
   * @param \{{{string}}\} {{$baseData}} {{pass the base64 image string}}
   * @desc {{this will change the base64 image string}}
   */
  baseToFileCrop($baseData) {
    // hide the form and make the accetp check box true
    this.changeFormState = false;
    this.imageTermsCheck = true;
    // cropper change title
    this.cropareaTitleState = true;
    // show hide state cropper area
    this.showcrop = true;

    setTimeout(() => {

      $(document).find('#blah').attr('src', '');
      $(document).find('#blah').attr('src', $baseData);
      // console.log("Came here", document.getElementById('blah'))
      // cropper init
      setTimeout(() => {

        var that = this;
        let image = document.getElementById('blah');
        // create the cropper obj
        let cropper = new Cropper(image, {});
        // destroy the cropper for the new image
        cropper.destroy();
        $('.cropper-container').remove();

        // get the data height and width
        let dataSettingWidth = this.cropperSettings.width;
        let dataSettingHeight = this.cropperSettings.height;

        // re init the cropper with valid settings
        cropper = new Cropper(image, {
          aspectRatio: dataSettingWidth / dataSettingHeight,
          minCropBoxWidth: dataSettingWidth,
          minCropBoxHeight: dataSettingHeight,
          crop: function(e) {
            let croppeddata = cropper.getCroppedCanvas({
              width: dataSettingWidth,
              heigth: dataSettingHeight,
            }).toDataURL();
            that.uploadedImageData.imagesource.image = croppeddata;
          }
        });

      }, 500);

    }, 1000);

  }



  baseToFileCropSelect($slctdata) {
    $(document).find('.uploadGalleryPopupBody').addClass('loading-added');

    // making state
    this.uploadedImageData.originalPicSrc = '';
    this.uploadedImageData.originalPicId = $slctdata.id;
    this.uploadedImageData.picStatus = 'O';

    // fetch image
    this.headerCoverServices.getBaseImg($slctdata.id)
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 0) {
            const imageData = data.images[0].imgBase_64string;
            // make it available in the crop area
            this.baseToFileCrop(imageData);
            // loader removed
            setTimeout(() => {
              $(document).find('.uploadGalleryPopupBody').removeClass('loading-added');
            }, 1000);
          }
        },
        error => {
          console.log(error);
          alert('Something went wrong to fetch original image');
          // loader removed
          $(document).find('.uploadGalleryPopupBody').removeClass('loading-added');
        }
      );
  }














}

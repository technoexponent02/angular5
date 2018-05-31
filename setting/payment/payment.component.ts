import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  /**
   * @property \{{{any}}\} {{paymentValue}} {{store the payment value here}}
   */
  paymentValue: any;

  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;

  message: string;


  /**
   * @constructor
   * @description {{DI will be pushed here}}
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _zone: NgZone
  ) {}

  getToken() {
    this.message = 'Loading...';

    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.expiryMonth,
      exp_year: this.expiryYear,
      cvc: this.cvc
    }, (status: number, response: any) => {

      // Wrapping inside the Angular zone
      this._zone.run(() => {
        if (status === 200) {
          this.message = `Success! Card token ${response.card.id}.`;
          console.log(response)
        } else {
          this.message = response.error.message;
        }
      });
    });
  }

  
  /**
   * @func {{ngOnInit}}
   * @description {{this is lifecycly hook}}
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      // this.id = +params['id']; // (+) converts string 'id' to a number
      this.paymentValue = params.id;
      // console.log(params)
    });
  }

}

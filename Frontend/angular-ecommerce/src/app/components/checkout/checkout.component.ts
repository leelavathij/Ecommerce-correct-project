import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2shopValidator } from 'src/app/validators/luv2shop-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup:FormGroup|any;

  totalPrice:number = 0;
  totalQuantity:number = 0;
  theCreditCardYears:number[]=[];
  theCreditCardMonths:number[]=[];
  countries:Country[]=[];
  states:State[]=[];

  shippingAddressStates:State[]=[];
  billingAddressStates:State[]=[];

  constructor(private formBuilder:FormBuilder,private luv2ShopService:Luv2ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup= this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:new FormControl('',[Validators.required,
                                      Validators.minLength(2),
                                      Luv2shopValidator.notOnlyWhiteSpace]),
        lastName:new FormControl('',[Validators.required,
                                     Validators.minLength(2),
                                     Luv2shopValidator.notOnlyWhiteSpace]),
        email:new FormControl('',[Validators.required,
                                  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street:new FormControl('',[Validators.required,
                                   Validators.minLength(2),
                                   Luv2shopValidator.notOnlyWhiteSpace]),
        city:new FormControl('',[Validators.required,
                                 Validators.minLength(2),
                                 Luv2shopValidator.notOnlyWhiteSpace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipcode:new FormControl('',[Validators.required,
                                    Validators.minLength(2),
                                    Luv2shopValidator.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street:new FormControl('',[Validators.required,
                                   Validators.minLength(2),
                                   Luv2shopValidator.notOnlyWhiteSpace]),
        city:new FormControl('',[Validators.required,
                                 Validators.minLength(2),
                                 Luv2shopValidator.notOnlyWhiteSpace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipcode:new FormControl('',[Validators.required,
                                    Validators.minLength(2),
                                    Luv2shopValidator.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType:new FormControl('',[Validators.required]),
        nameOnCard:new FormControl('',[Validators.required,
                                       Validators.minLength(2),
                                       Luv2shopValidator.notOnlyWhiteSpace]),
        cardNumber:new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode:new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')]),
        expirationMonth:[''],
        expirationYear:['']
      })     
    });

    //Populating the credit card month values
    let startMonth = new Date().getMonth();
      this.getMonths(startMonth);
    //Populating credit card years
      this.getYears();

      this.luv2ShopService.getCountries().subscribe(
        data=>{
          console.log("Retrieved countries:"+data);
          this.countries = data;
        }
      )
  }
  getMonths(startMonth:number)
  {
    
    console.log("start month "+startMonth);
    this.luv2ShopService.getCreditCardMonths(startMonth+1).subscribe(
      data=>{
        console.log("Retrieved months "+JSON.stringify(data));
        this.theCreditCardMonths = data;
      }
    );
  }
  getYears()
  {
    this.luv2ShopService.getCreditCardYear().subscribe(
      data=>{
        console.log("Retrieved years "+JSON.stringify(data));
        this.theCreditCardYears = data;
      }
    );
  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipcode(){return this.checkoutFormGroup.get('shippingAddress.zipcode');}

  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipcode(){return this.checkoutFormGroup.get('billingAddress.zipcode');}

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}




  copyShippingAddressToBillingAddress(event:any)
  {
    if(event.target.checked)
    {
      this.checkoutFormGroup.controls.billingAddress
      .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      //bug fix for when check box is clicked the state also should be populated 
      this.billingAddressStates = this.shippingAddressStates;
    }
    else
    {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates=[];
    }
  }

  handleMonthsAndYears()
  {
    const creditCardForm = this.checkoutFormGroup.get('creditCard');
    const currentYear:number = new Date().getFullYear();
    const selectedYear:number = creditCardForm.value.expirationYear;
    let startMonth:number;
    if(currentYear===selectedYear)
    {
      startMonth = new Date().getMonth()+1;
    }
    else
    {
      startMonth = 1;
    }
    this.getMonths(startMonth-1);
  }

  getStates(formGroupName:string)
  {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    this.luv2ShopService.getStates(countryCode).subscribe(
      data=>{
        if(formGroupName==='shippingAddress')
        {
          this.shippingAddressStates = data;
        }
        else
        {
          this.billingAddressStates = data;
        }

        //setting first value as default value
        formGroup.get('state').setValue(data[0]);
      }
    );

  }

  onSubmit()
  {
    if(this.checkoutFormGroup.invalid)
    {
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log("Handling the form input");
    console.log(this.checkoutFormGroup.get('customer').value);
  }

}

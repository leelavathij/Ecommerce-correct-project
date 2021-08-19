import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems:CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }
  addToCart(theCartItem:CartItem)
  {
    let alreadyExistingCartItem:boolean = false;
    let existingCartItem:CartItem|undefined;
    if(this.cartItems.length>0)
    {
     /* for(let tempCartItem of this.cartItems)
      {
          if(tempCartItem.id===theCartItem.id)
          {
            existingCartItem = tempCartItem;
            break;
          }
      } which is equal to the below line*/
      existingCartItem = this.cartItems.find(tempCartItem=> tempCartItem.id === theCartItem.id);
      alreadyExistingCartItem = (existingCartItem!=undefined);
    }
    if(alreadyExistingCartItem)
    {
      if(existingCartItem!=undefined)
      {
        existingCartItem.quantity++;
      }
    }
    else
    {
      this.cartItems.push(theCartItem);
    }
    this.computeTotals();
  }
  computeTotals() {
    let thePriceValue:number=0;
    let theQuntityValue:number=0;
    for(let currentItem of this.cartItems)
    {
       if(currentItem.unitPrice!=null)
       {
         thePriceValue += currentItem.quantity*currentItem.unitPrice;
         theQuntityValue += currentItem.quantity;
       }
    }
    this.logCartData(thePriceValue,theQuntityValue);
    this.totalPrice.next(thePriceValue);
    this.totalQuantity.next(theQuntityValue);
  }
  logCartData(thePriceValue: number, theQuntityValue: number) {
    for(let item of this.cartItems)
    {
      console.log(`name:${item.name} unitPrice:${item.unitPrice} quntity:${item.quantity}`);
    }
    console.log(`TotalPrice:${thePriceValue} TotalQuantity:${theQuntityValue}`);
  }

  decrementQuantity(theCartItem: CartItem) {
    
    theCartItem.quantity--;
    if(theCartItem.quantity===0)
    {
      this.remove(theCartItem);
    }
    else
    {
      this.computeTotals();
    }
  }
  remove(theCartItem:CartItem)
  {
    let itemIndex = this.cartItems.findIndex(tempCartItem=>tempCartItem.id===theCartItem.id);
    if(itemIndex>-1)
    {
      this.cartItems.splice(itemIndex,1);
      this.computeTotals();
    }
  }

}

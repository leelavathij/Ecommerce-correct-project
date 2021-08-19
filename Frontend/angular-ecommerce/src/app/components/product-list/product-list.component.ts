import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] | undefined;
  currentCategoryId:number|undefined;
  categoryId:any|undefined;
  searchMode:boolean | undefined;
  keyWord : string | undefined;
  previousCategoryId: number = 1;
  previousKeyword:string|undefined;
  //properties for pagination
  thePageNumber:number = 1;
  thePageSize:number = 5;
  theTotalElements:number = 0;
  
  constructor(private productService:ProductService,
              private cartService:CartService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
    this.listOfProducts();
    });
  }
  listOfProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode)
    {
       this.handleSearchProducts();
    }
    else
    {
      this.handleListProducts();
    }
  }

  handleSearchProducts(){

    const theKeyword = this.route.snapshot.paramMap.get('keyword');
    if(theKeyword!=null)
    {
      this.keyWord = theKeyword;
    }
    else
    {
      this.keyWord = 'Books';
    }
    if(this.previousKeyword!=this.keyWord)
    {
      this.thePageNumber = 1;
    }
    this.previousKeyword = this.keyWord;
    this.productService.searchProductsPagination(this.thePageNumber-1,
                                                this.thePageSize,
                                                this.keyWord ).subscribe(this.processResults());

  }

  handleListProducts(){
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId)
    {
      this.categoryId = this.route.snapshot.paramMap.get('id');
      if(this.categoryId!=null)
      {
        this.currentCategoryId = +this.categoryId;
      }
      else
      {
        this.currentCategoryId = 1;
      }
    }
    else
    {
      this.currentCategoryId = 1;
    }

    if(this.previousCategoryId!=this.currentCategoryId)
    {
      this.thePageNumber = 1;
    }
    this.previousCategoryId=this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId},pageNumber=${this.thePageNumber}`);

    this.productService.getProductListPagination(this.thePageNumber-1,
                                                  this.thePageSize,this.currentCategoryId)
                                                  .subscribe(this.processResults())

   /* this.productService.getProductList(this.currentCategoryId).subscribe(
      data=>{
       this.products=data;
      }
    )*/

  }
  processResults(){
    return (data: { _embedded: { products: Product[] | undefined; }; page: { number: number; size: number; totalElements: number; }; })=>{
      this.products = data._embedded.products,
      this.thePageNumber = data.page.number+1,
      this.thePageSize = data.page.size,
      this.theTotalElements = data.page.totalElements
    };
  }

  updatePageSize(pageSize:number)
  {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listOfProducts(); 
  }

  addToCart(theProduct:Product)
  {
    console.log(`adding to the cart::${theProduct.name}`);
    const cartItem:CartItem = new CartItem(theProduct);
    this.cartService.addToCart(cartItem);

  }

}

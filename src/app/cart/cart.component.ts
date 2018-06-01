import { Observable } from 'rxjs/Observable';
import { Product } from './../models/product';
import { DocPipe } from './../doc.pipe';
import { ProductService } from './../services/product.service';
import { CartItem, ShoppingCartService } from '../services/shopping-cart.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';
import {Router} from '@angular/router';
import {number} from 'ng2-validation/dist/number';
import {AddressModel} from '../models/Address-Model';
import {AngularFireAuth} from 'angularfire2/auth';
import {AddressService} from '../services/address.service';
import {OrderService} from '../services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  lim: number;
  nu: number;
  checked: boolean;
  Address$: Observable<AddressModel[]>;
 useraddress: string [] = [];
  uid: string;
  hasaddress: boolean;
  hello: boolean;
  adresschosen: string;


  constructor(public product: ProductService, private cart: ShoppingCartService, private router: Router, public af: AngularFireAuth, public ad: AddressService, public ord: OrderService) {
    this.items$ = cart.getItems();
    this.lim = 0;
    this.nu = 0;
    this.checked = false;
    this.Address$ = ad.getAll().map(adresses => adresses.filter(p => p.uid === this.uid));
    this.hasaddress = false;
    this.hello = false;
    this.adresschosen = "";
    // cart.delete();

    this.af.auth.onAuthStateChanged((user) => {
        if (user != null) {
          this.uid = user.uid;

        }
      }
    );

    this.cartTotal$ = this.items$.switchMap(items => {
      this.lim = items.length;
      return Observable.from(items).mergeMap(line => {
        return this.product.fromRef(line.product).take(1).map(product => product.price * line.amount);
      }).reduce((acc, x) => acc + x, 0);
    });

  }


  ngOnInit() {
  }

  trackByFn(index, item: CartItem) {
    return item.product != null ? item.product.id : null;
  }
  delete(product: firebase.firestore.DocumentReference) {
    this.cart.removeItem(product.id);
    this.lim -= 1;
  }
  updateItem(product: firebase.firestore.DocumentReference, amount: number) {
    if (this.checked == true) {
      this.cart.setItemfinal(product.id, +amount);
      this.nu += 1;
    } else {
      if (amount < 0) { amount = 0; }
      this.cart.setItem(product.id, +amount);
    }
  }

hey() {
  this.checked = true;
}
  navigatetocheckout() {
    if(this.adresschosen.length > 3){
      this.ord.setaddress(this.adresschosen);
      this.router.navigateByUrl('cart/checkout');
    }
  }
  addressistrue() {
    this.hasaddress = true;
  }
  navigatetoaddress() {
    this.router.navigateByUrl('Address');
    this.hello = true;
  }
}
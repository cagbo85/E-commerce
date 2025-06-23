import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    // Récupérer le panier depuis le localStorage au démarrage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(product: Product): void {
    const existingItemIndex = this.cartItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      // Si le produit existe déjà dans le panier, augmenter la quantité
      this.cartItems[existingItemIndex].quantity += 1;
    } else {
      // Sinon, ajouter le produit avec une quantité de 1
      this.cartItems.push({ product, quantity: 1 });
    }

    this.updateCart();
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const itemIndex = this.cartItems.findIndex(item => item.product.id === productId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Si la quantité est 0 ou négative, supprimer l'article
        this.removeFromCart(productId);
      } else {
        // Sinon, mettre à jour la quantité
        this.cartItems[itemIndex].quantity = quantity;
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getCartCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  private updateCart(): void {
    // Mettre à jour le BehaviorSubject
    this.cartSubject.next([...this.cartItems]);

    // Sauvegarder dans le localStorage
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}

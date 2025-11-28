import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode'; // Uvezi jwt-decode
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Artikal } from './models/artikal';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {

  private apiUrl = 'http://localhost:4000/korisnik';

  constructor(private http: HttpClient) { }
  private cartItemsCount = new BehaviorSubject<number>(0);
  cartItemsCount$ = this.cartItemsCount.asObservable(); // Observable za praćenje promena
  favoriteItemsCount$ = new BehaviorSubject<number>(0); // Observable za broj omiljenih artikala


  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email });
  }

  login(email: string, password: string): Observable<any> {
    // Šaljemo POST zahtev sa emailom i lozinkom
    const data = {
      email: email,
      password: password
    };
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        const token = response.token; 
        if (token) {
          localStorage.setItem('token', token);
        }
      })
    );
  }
  

  // Registracija korisnika
  register(username: string, password: string, ime: string, prezime: string, email: string, tipProfila: string) {
    const data = {
      username: username,
      password: password,
      ime: ime,
      prezime: prezime,
      email: email,
      tipProfila: tipProfila
    };
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Provera korisničkog imena
  checkUserName(username: string) {
    const data = { username: username };
    return this.http.post(`${this.apiUrl}/checkusername`, data);
  }

  // Provera email adrese
  checkEmail(email: string) {
    const data = { email: email };
    return this.http.post(`${this.apiUrl}/checkemail`, data);
  }

  // Odjava - uklanjamo token iz localStorage
  logout() {
    localStorage.removeItem('token');
  }

  // Proveravamo da li je korisnik prijavljen - na osnovu postojanja tokena
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Vraća true ako postoji token
  }

  isKupac(): boolean{
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const tipProfila = decodedToken?.tip;  // Pretpostavljamo da token ima polje "tipProfila"
      if(tipProfila=='kupac'){
        return true;
      }
      else {
        return false;
      }
    } 
    else
    {
      return false;
    }
  }

  addToFavourites(userId: string, artikalId: string) {
    const data = { userId, artikalId };
    return this.http.post(`${this.apiUrl}/addFavourite`, data);
  }

  // Metoda za uklanjanje artikla iz omiljenih
  removeFromFavourites(userId: string, artikalId: string) {
    const data = { userId, artikalId };
    return this.http.post(`${this.apiUrl}/removeFavourite`, data);
  }

  // Metoda za dobijanje omiljenih artikala korisnika
  getFavourites(userId: string) {
    return this.http.get<{ favourites: any[] }>(`${this.apiUrl}/favourites/${userId}`);
  }



  addToCart(userId: string, artikalId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-to-cart`, { userId, artikalId});
  }

  removeFromCart(userId: string, artikalId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove-from-cart`, { userId, artikalId });
  }

  getCart(userId: string) {
    return this.http.get<{ cart: Artikal[] }>(`${this.apiUrl}/${userId}/cart`);
  }

  setCartCount(count: number) {
    this.cartItemsCount.next(count);
  }

  getCartCount(userId: string): Observable<any> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/${userId}/cart-count`).pipe(
      tap(response => {
        this.setCartCount(response.count); // Ažuriraj lokalni broj artikala u korpi
      })
    );
  }

  getFavoriteCount(userId: string): Observable<any> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/${userId}/favorite-count`).pipe(
      tap(response => {
        this.setFavoriteCount(response.count); // Ažuriraj lokalni broj omiljenih artikala
      })
    );
  }
  
  setFavoriteCount(count: number) {
    this.favoriteItemsCount$.next(count); // Emituj novu vrednost omiljenih artikala
  }
  

  addToFavorites(userId: string, storeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-favorite`, { userId, storeId });
  }

  // Uklanjanje prodavnice iz omiljenih
  removeFromFavorites(userId: string, storeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove-favorite`, { userId, storeId });
  }
  
  getFavoritesStores(userId: string): Observable<any> {
    return this.http.get<{ omiljeneProdavnice: any[] }>(`${this.apiUrl}/${userId}/favorites`);
  }
  
  // Dodaj metodu za potvrdu kupovine
potvrdiKupovinu(userId: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/potvrdi-kupovinu`, { userId });
}


}

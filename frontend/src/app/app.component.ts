import { Component } from '@angular/core';
import { KorisnikService } from './korisnik.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode'; // Uvezi jwt-decode za token


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'diplomski';
  tipProfila: string | null = null;  // Dodaj tip profila
  cartCount: number = 0; // Broj artikala u korpi
  userId: string = ''; // Korisnički ID
  favoriteCount: number = 0;


  constructor(private korisnikService: KorisnikService, private router: Router) {}

  ngOnInit() {
    const userId = this.getUserIdFromToken();
    if (userId) {
      this.korisnikService.getCartCount(userId).subscribe(); // Učitaj broj artikala iz baze
      this.korisnikService.getFavoriteCount(userId).subscribe(); // Učitaj broj omiljenih artikala

      this.korisnikService.cartItemsCount$.subscribe(count => {
        this.cartCount = count;
      });
      this.korisnikService.favoriteItemsCount$.subscribe(count => {
        this.favoriteCount = count;
      });
    }

    // Pretplati se na promene broja artikala u korpi
    
  }

  // Funkcija za dekodovanje korisničkog ID-a iz tokena
  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      return decodedToken.id;
    }
    return null;
  }

  // Provera da li je korisnik prijavljen
  isLoggedIn(): boolean {
    return this.korisnikService.isLoggedIn();
  }

  isKupac(): boolean {
    return this.korisnikService.isKupac();
  }


  // Metoda za odjavu
  logout() {
    this.korisnikService.logout();
    this.router.navigate(['/']); // Preusmeravanje na početnu stranicu nakon odjave
  }
  

 
}
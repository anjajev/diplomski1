import { Component } from '@angular/core';
import { KorisnikService } from '../korisnik.service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-omiljene-prodavnice',
  templateUrl: './omiljene-prodavnice.component.html',
  styleUrls: ['./omiljene-prodavnice.component.css']
})
export class OmiljeneProdavniceComponent {
  omiljeneProdavnice: any[] = [];

  constructor(private korisnikService: KorisnikService) {}

  ngOnInit(): void {
    const userId = this.getUserIdFromToken();
    if (userId) {
      this.korisnikService.getFavoritesStores(userId).subscribe(
        (response) => {
          this.omiljeneProdavnice = response.omiljeneProdavnice;
        },
        (error) => {
          console.error('Greška pri dohvatanju omiljenih prodavnica:', error);
        }
      );
    }
  }

  getUserIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      return decodedToken.id;
    }
    return '';
  }


  getStoreProfileImage(image: string): string {
    return `http://localhost:4000/${image}`;
  }
}

import { Component } from '@angular/core';
import { KorisnikService } from '../korisnik.service';
import jwt_decode from 'jwt-decode';
import { ArtikalService } from '../artikal.service';
import { Artikal } from '../models/artikal';

@Component({
  selector: 'app-omiljena-odeca',
  templateUrl: './omiljena-odeca.component.html',
  styleUrls: ['./omiljena-odeca.component.css']
})
export class OmiljenaOdecaComponent {
  omiljeniArtikli: Artikal[] = [];
  favourites: string[] = [];
  userId: string = '';

  constructor(
    private korisnikService: KorisnikService,
    private artikalService: ArtikalService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwt_decode(token);
      this.userId = decoded.id;
      this.fetchFavourites();
    }
  }

  // Dohvati omiljene artikle korisnika
  fetchFavourites() {
    this.korisnikService.getFavourites(this.userId).subscribe(
      (response) => {
        this.omiljeniArtikli = response.favourites;
        this.favourites = this.omiljeniArtikli.map(a => a._id);
      },
      (error) => {
        console.error('Greška pri dohvatanju omiljenih:', error);
      }
    );
  }

  toggleFavourite(artikalId: string) {
    if (this.favourites.includes(artikalId)) {
      this.korisnikService.removeFromFavourites(this.userId, artikalId).subscribe(() => {
        this.favourites = this.favourites.filter(id => id !== artikalId);
        this.omiljeniArtikli = this.omiljeniArtikli.filter(a => a._id !== artikalId);
      });
    } else {
      this.korisnikService.addToFavourites(this.userId, artikalId).subscribe(() => {
        this.favourites.push(artikalId);
      });
    }
  }

  isFavourite(id: string): boolean {
    return this.favourites.includes(id);
  }

  // ⭐ Ispravljeno — prima string | string[] | undefined
  getArtikalImage(imagePath: string | string[] | undefined): string {
    if (!imagePath) return 'assets/no-image.png';

    const path =
      Array.isArray(imagePath) && imagePath.length > 0
        ? imagePath[0]
        : (imagePath as string);

    if (!path) return 'assets/no-image.png';

    return `http://localhost:4000/${path}`;
  }
}

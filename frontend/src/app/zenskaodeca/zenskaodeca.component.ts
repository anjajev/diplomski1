import { Component } from '@angular/core';
import { ArtikalService } from '../artikal.service';
import { Artikal } from '../models/artikal';
import { KorisnikService } from '../korisnik.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-zenskaodeca',
  templateUrl: './zenskaodeca.component.html',
  styleUrls: ['./zenskaodeca.component.css']
})
export class ZenskaodecaComponent {
  artikli: Artikal[] = [];
  filteredArtikli: Artikal[] = [];
  favourites: string[] = [];
  userId: string = '';

  // filteri
  selectedTip: string = '';
  selectedVelicina: string = '';
  selectedBoja: string = '';
  minCena: number | null = null;
  maxCena: number | null = null;

  constructor(
    private artikalService: ArtikalService,
    private korisnikService: KorisnikService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.userId = decodedToken.id;
      this.fetchFavourites();
      this.fetchArtikli();
    } else {
      this.fetchArtikli();
    }
  }

  isLoggedIn(): boolean {
    return this.korisnikService.isLoggedIn();
  }

  // Dohvatanje artikala
  fetchArtikli() {
    this.artikalService.getArtikliByCategory('zenski').subscribe(
      (response) => {
        this.artikli = response.artikli;
        this.filteredArtikli = this.artikli;
      },
      (error) => {
        console.error('Greška pri dohvatanju artikala:', error);
      }
    );
  }

  setTipFilter(tip: string) {
    this.selectedTip = tip;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredArtikli = this.artikli.filter((artikal) => {
      const matchesTip = this.selectedTip
        ? artikal.tip === this.selectedTip
        : true;
      const matchesVelicina = this.selectedVelicina
        ? artikal.velicina === this.selectedVelicina
        : true;
      const matchesBoja = this.selectedBoja
        ? artikal.boja === this.selectedBoja
        : true;
      const matchesCena =
        (!this.minCena || artikal.cena >= this.minCena) &&
        (!this.maxCena || artikal.cena <= this.maxCena);

      return matchesTip && matchesVelicina && matchesBoja && matchesCena;
    });
  }

  // Omiljeni
  fetchFavourites() {
    this.korisnikService.getFavourites(this.userId).subscribe(
      (response) => {
        this.favourites = response.favourites.map(
          (artikal: any) => artikal._id
        );
      },
      (error) => {
        console.error('Greška pri dohvatanju omiljenih:', error);
      }
    );
  }

  toggleFavourite(artikalId: string) {
    if (this.favourites.includes(artikalId)) {
      this.korisnikService
        .removeFromFavourites(this.userId, artikalId)
        .subscribe(() => {
          this.favourites = this.favourites.filter((id) => id !== artikalId);
        });
    } else {
      this.korisnikService
        .addToFavourites(this.userId, artikalId)
        .subscribe(() => {
          this.favourites.push(artikalId);
        });
    }
  }

  isFavourite(artikalId: string): boolean {
    return this.favourites.includes(artikalId);
  }

  // ⬇⬇⬇ ISPRAVLJENO – radi sa string | string[] | undefined
  getArtikalImage(imagePath: string | string[] | undefined): string {
    if (!imagePath) {
      return 'assets/no-image.png'; // ako nema slike
    }

    const path =
      Array.isArray(imagePath) && imagePath.length > 0
        ? imagePath[0]
        : (imagePath as string);

    if (!path) {
      return 'assets/no-image.png';
    }

    return `http://localhost:4000/${path}`;
  }

  addToCart(artikalId: string) {
    this.korisnikService.addToCart(this.userId, artikalId).subscribe(
      () => {
        console.log('Artikal dodat u korpu');
        this.korisnikService.getCartCount(this.userId).subscribe();
      },
      (error) => {
        console.error('Greška pri dodavanju u korpu:', error);
      }
    );
  }
}

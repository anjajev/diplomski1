import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtikalService } from '../artikal.service';
import { Artikal } from '../models/artikal';
import jwt_decode from 'jwt-decode';
import { KorisnikService } from '../korisnik.service';
import { Prodavnica } from '../models/prodavnica';

declare var google: any;

@Component({
  selector: 'app-artikal-detalji',
  templateUrl: './artikal-detalji.component.html',
  styleUrls: ['./artikal-detalji.component.css']
})
export class ArtikalDetaljiComponent implements OnInit {
  artikal: Artikal = {} as Artikal;
  prodavnica: Prodavnica = {} as Prodavnica;
  relatedArtikli: Artikal[] = [];
  prodavnicaLokacija: string = '';
  userId: string = '';
  favourites: string[] = [];

  // carousel index za detalj stranice
  carouselIndex: number = 0;

  constructor(
    private artikalService: ArtikalService,
    private route: ActivatedRoute,
    private korisnikService: KorisnikService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.userId = decodedToken.id;
    }

    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.fetchArtikal(id);
      }
    });

    // (po želji) učitavanje omiljenih
    // this.korisnikService.getFavourites(this.userId).subscribe(ids => this.favourites = ids);
  }

  // Dohvatanje artikla, prodavnice i srodnih artikala
  fetchArtikal(id: string) {
    this.artikalService.getArtikalWithProdavnica(id).subscribe(
      (response: any) => {
        this.artikal = response.artikal;
        this.prodavnica = response.prodavnica;
        this.relatedArtikli = response.relatedArtikli || [];

        this.carouselIndex = 0; // reset na prvu sliku

        if (this.prodavnica?.adresa) {
          this.loadMap(this.prodavnica.adresa);
        }
      },
      (error) => {
        console.error('Greška pri dohvatanju artikla:', error);
      }
    );
  }

  // Vrati URL slike artikla (prima string ili string[])
  getArtikalImage(imagePath: string | string[] | undefined): string {
    if (!imagePath) {
      return 'assets/no-image.png'; // fallback placeholder
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

  // Vrati URL slike prodavnice
  getProdavnicaImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'assets/no-shop.png'; // fallback ako nema sliku
    }
    return `http://localhost:4000/${imagePath}`;
  }

  // Google mapa
  loadMap(address: string) {
    if (!address) return;

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: address }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;

        const map = new google.maps.Map(
          document.getElementById('map') as HTMLElement,
          {
            zoom: 14,
            center: location
          }
        );

        new google.maps.Marker({
          position: location,
          map: map
        });
      } else {
        console.error('Geocoding nije uspeo zbog: ' + status);
      }
    });
  }

  // Dodavanje u korpu
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

  // Omiljeni
  toggleFavourite(artikalId: string) {
    if (this.favourites.includes(artikalId)) {
      this.korisnikService.removeFromFavourites(this.userId, artikalId).subscribe(
        () => {
          this.favourites = this.favourites.filter((id) => id !== artikalId);
        }
      );
    } else {
      this.korisnikService.addToFavourites(this.userId, artikalId).subscribe(
        () => {
          this.favourites.push(artikalId);
        }
      );
    }
  }

  isFavourite(artikalId: string): boolean {
    return this.favourites.includes(artikalId);
  }

  // === CAROUSEL FUNKCIJE ZA DETALJ STRANICU ===

  nextCarouselImage() {
    if (!this.artikal.slike || this.artikal.slike.length === 0) return;
    this.carouselIndex =
      (this.carouselIndex + 1) % this.artikal.slike.length;
  }

  prevCarouselImage() {
    if (!this.artikal.slike || this.artikal.slike.length === 0) return;
    this.carouselIndex =
      (this.carouselIndex - 1 + this.artikal.slike.length) %
      this.artikal.slike.length;
  }

  goToCarouselImage(index: number) {
    if (!this.artikal.slike || this.artikal.slike.length === 0) return;
    this.carouselIndex = index;
  }
}

import { Component } from '@angular/core';
import { Prodavnica } from '../models/prodavnica';
import { Artikal } from '../models/artikal';
import { ActivatedRoute } from '@angular/router';
import { ProdavnicaService } from '../prodavnica.service';
import { KorisnikService } from '../korisnik.service';
import jwt_decode from 'jwt-decode';
import { RecenzijaService } from '../recenzija.service';
import { Review } from '../models/review';

declare var google: any;

@Component({
  selector: 'app-prodavac',
  templateUrl: './prodavac.component.html',
  styleUrls: ['./prodavac.component.css']
})
export class ProdavacComponent {
  prodavnica: Prodavnica = {} as Prodavnica;
  artikliProdavnice: Artikal[] = [];
  filteredArtikli: Artikal[] = [];
  kategorije: string[] = ['haljina', 'jakna', 'majica', 'farmerice', 'pantalone'];

  userId: string = '';

  recenzije: any[] = [];
  currentReviewIndex: number = 0;
  reviewsToShow: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private prodavnicaService: ProdavnicaService,
    private korisnikService: KorisnikService,
    private recenzijaService: RecenzijaService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwt_decode(token);
      this.userId = decoded.id;
    }

    const storeId = this.route.snapshot.paramMap.get('id');
    if (storeId) {
      this.prodavnicaService.dohvatiProdavnicuSaArtiklima(storeId).subscribe(
        (response) => {
          this.prodavnica = response.prodavnica;
          this.artikliProdavnice = this.prodavnica.artikli;
          this.filteredArtikli = this.artikliProdavnice;

          this.loadMap(this.prodavnica.adresa);
          this.dohvatiRecenzije(storeId);
        },
        (error) => console.error('Greška pri dohvatanju prodavnice', error)
      );
    }
  }

  // Get recenzije
  dohvatiRecenzije(storeId: string): void {
    this.recenzijaService.dohvatiRecenzije(storeId).subscribe(
      (response: any[]) => {
        this.recenzije = response.map((rec) => ({
          ...rec,
          kupac: rec.kupac ? { ime: rec.kupac.ime } : { ime: 'Nepoznato' }
        }));
        this.updateReviewsToShow();
      },
      (error) => console.error('Greška pri dohvatanju recenzija', error)
    );
  }

  loadMap(address: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;

        const map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: location
        });

        new google.maps.Marker({ position: location, map });
      }
    });
  }

  addToFavorites(): void {
    this.korisnikService
      .addToFavorites(this.userId, this.prodavnica._id)
      .subscribe(
        () => console.log('Prodavnica dodata u omiljene'),
        (error) => console.error('Greška pri dodavanju u omiljene', error)
      );
  }

  getStoreProfileImage(image: string | undefined): string {
    if (!image) return 'assets/no-image.png';
    return `http://localhost:4000/${image}`;
  }

  // ⭐ ISPRAVLJENA FUNKCIJA → radi sa string | string[] | undefined
  getProductImage(image: string | string[] | undefined): string {
    if (!image) return 'assets/no-image.png';

    const path =
      Array.isArray(image) && image.length > 0 ? image[0] : (image as string);

    if (!path) return 'assets/no-image.png';

    return `http://localhost:4000/${path}`;
  }

  setCategoryFilter(category: string): void {
    this.filteredArtikli =
      category === ''
        ? this.artikliProdavnice
        : this.artikliProdavnice.filter((a) => a.tip === category);
  }

  updateReviewsToShow(): void {
    this.reviewsToShow = this.recenzije.slice(
      this.currentReviewIndex,
      this.currentReviewIndex + 2
    );
  }

  previousReview(): void {
    if (this.currentReviewIndex > 0) {
      this.currentReviewIndex -= 2;
      this.updateReviewsToShow();
    }
  }

  nextReview(): void {
    if (this.currentReviewIndex < this.recenzije.length - 2) {
      this.currentReviewIndex += 2;
      this.updateReviewsToShow();
    }
  }
}

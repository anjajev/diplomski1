import { Component } from '@angular/core';
import { NarudzbineService } from '../narudzbine.service';
import jwt_decode from 'jwt-decode';
import { Order } from '../models/orders';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecenzijaService } from '../recenzija.service';

@Component({
  selector: 'app-prethodne-kupovine',
  templateUrl: './prethodne-kupovine.component.html',
  styleUrls: ['./prethodne-kupovine.component.css']
})
export class PrethodneKupovineComponent {
  userId: string = '';
  narudzbinaId: string = '';

  narudzbine: Order[] = [];
  isReviewModalOpen: boolean = false;
  currentOrderId: string = '';
  currentProdavnicaId: string = '';
  reviewForm: FormGroup;
  ocena: number = 0;

  constructor(
    private ordersService: NarudzbineService,
    private recenzijeService: RecenzijaService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      ocena: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      komentar: ['']
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.userId = decodedToken.id;
      this.fetchNarudzbine();
    }
  }

  fetchNarudzbine() {
    this.ordersService.dohvatiNarudzbineZaKorisnika(this.userId).subscribe(
      (response: Order[]) => {
        this.narudzbine = response;
      },
      (error: any) => {
        console.error('Greška pri dohvatanju narudžbina:', error);
      }
    );
  }

  // ⬇⬇⬇ bitna izmena – podržava string | string[]
  getArtikalImage(imagePath: string | string[] | undefined): string {
    if (!imagePath) {
      return 'assets/no-image.png';
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

  getStatusExplanation(status: string): string {
    switch (status) {
      case 'U obradi':
        return 'Narudžbina je primljena i u procesu obrade.';
      case 'Poslato':
        return 'Vaši artikli su poslati i uskoro će stići na adresu.';
      case 'Potvrđeno':
      case 'Potvrdjeno':
        return 'Narudžbina je potvrđena i dostavljena.';
      default:
        return '';
    }
  }

  confirmDelivery(orderId: string) {
    const narudzbina: Order | undefined = this.narudzbine.find(
      (n) => n._id === orderId
    );

    if (narudzbina) {
      this.currentProdavnicaId = narudzbina.prodavnica;
      this.narudzbinaId = narudzbina._id;
      narudzbina.status = 'Potvrdjeno';

      this.ordersService.postaviStatusNaPotvrdjeno(orderId).subscribe(
        () => {
          this.openReviewModal();
        },
        (error) => {
          console.error('Greška pri potvrdi prijema narudžbine:', error);
        }
      );
    }
  }

  openReviewModal() {
    this.isReviewModalOpen = true;
  }

  closeReviewModal() {
    this.isReviewModalOpen = false;
    this.ocena = 0;
    this.reviewForm.reset({
      ocena: 5,
      komentar: ''
    });
  }

  rate(stars: number) {
    this.ocena = stars;
  }

  submitReview() {
    if (this.reviewForm.valid) {
      const komentar = this.reviewForm.get('komentar')?.value;

      this.recenzijeService
        .dodajRecenziju(
          this.userId,
          this.currentProdavnicaId,
          this.ocena,
          komentar,
          this.narudzbinaId
        )
        .subscribe(
          () => {
            this.closeReviewModal();
            alert('Hvala na recenziji!');
          },
          (error) => {
            console.error('Greška pri slanju recenzije:', error);
          }
        );
    }
  }
}

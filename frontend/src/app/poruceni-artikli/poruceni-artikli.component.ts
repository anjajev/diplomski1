import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Order } from '../models/orders';
import { NarudzbineService } from '../narudzbine.service';

@Component({
  selector: 'app-poruceni-artikli',
  templateUrl: './poruceni-artikli.component.html',
  styleUrls: ['./poruceni-artikli.component.css']
})
export class PoruceniArtikliComponent implements OnInit {
  narudzbine: Order[] = [];
  storeId: string = ''; // ID prodavnice
  successMessage: string | null = null;

  constructor(private narudzbineService: NarudzbineService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.storeId = decodedToken.id; // ID prodavnice iz tokena
      this.fetchOrders();
    }
  }

  fetchOrders() {
    this.narudzbineService
      .dohvatiNarudzbineZaProdavnicu(this.storeId, 'U obradi')
      .subscribe(
        (response: Order[]) => {
          this.narudzbine = response;
        },
        (error) => {
          console.error('Greška pri dohvatanju poručenih artikala:', error);
        }
      );
  }

  markAsSent(orderId: string) {
    this.narudzbineService.postaviStatusNaPoslato(orderId).subscribe(
      () => {
        this.fetchOrders();
        this.successMessage = 'Narudžbina je označena kao poslata.';
        setTimeout(() => (this.successMessage = null), 5000);
      },
      (error) => {
        console.error('Greška pri ažuriranju narudžbine:', error);
      }
    );
  }

  // ⬇⬇⬇ OVDE JE BITNA PROMENA
  getArtikalImage(imagePath: string | string[] | undefined): string {
    if (!imagePath) {
      return 'assets/no-image.png'; // fallback, ako nema slike
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
}

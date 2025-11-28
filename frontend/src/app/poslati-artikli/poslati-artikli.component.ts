import { Component, OnInit } from '@angular/core';
import { Order } from '../models/orders';
import { NarudzbineService } from '../narudzbine.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-poslati-artikli',
  templateUrl: './poslati-artikli.component.html',
  styleUrls: ['./poslati-artikli.component.css']
})
export class PoslatiArtikliComponent implements OnInit {
  narudzbine: Order[] = [];
  storeId: string = '';
  successMessage: string | null = null;

  constructor(private narudzbineService: NarudzbineService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.storeId = decodedToken.id;
      this.fetchOrders();
    }
  }

  fetchOrders() {
    this.narudzbineService
      .dohvatiNarudzbineZaProdavnicu(this.storeId, 'Poslato')
      .subscribe(
        (response: Order[]) => {
          this.narudzbine = response;
        },
        (error) => {
          console.error('Greška pri dohvatanju poslatih artikala:', error);
        }
      );
  }

  getStarsArray(count: number): number[] {
    return Array(count).fill(0);
  }

  // ⭐ OVO JE KLJUČNA PROMENA — PODRŽAVA I STRING I STRING[]
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

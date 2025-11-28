import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './models/orders';

@Injectable({
  providedIn: 'root'
})
export class NarudzbineService {
  private apiUrl = 'http://localhost:4000/orders';

  constructor(private http: HttpClient) {}

  // Kreiranje nove narudžbine
// Kreiranje nove narudžbine
kreirajNarudzbinu(purchaseData: any): Observable<Order> {
  return this.http.post<Order>(`${this.apiUrl}/kreirajNarudzbinu`, purchaseData);
}


  // Dohvatanje narudžbina za određenu prodavnicu
  dohvatiNarudzbineZaProdavnicu(prodavnicaId: string, status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/prodavnica/${prodavnicaId}`, {
      params: { status }
    });
  }
  
  // Dodaj ovu funkciju u orders.service.ts
dohvatiNarudzbineZaKorisnika(kupacId: string): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrl}/kupac/${kupacId}`);
}


  // Potvrđivanje narudžbine
  potvrdiNarudzbinu(narudzbinaId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/potvrdiNarudzbinu/${narudzbinaId}`, {});
  }

  // Postavljanje statusa narudžbine na "Poslato"
  postaviStatusNaPoslato(narudzbinaId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/poslato/${narudzbinaId}`, {});
  }

  postaviStatusNaPotvrdjeno(narudzbinaId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/potvrdjeno/${narudzbinaId}`, {});
  }

  getStatistika(): Observable<{ items: number; price: number }[]> {
    return this.http.get<{ items: number; price: number }[]>(`${this.apiUrl}/statistika`);
}

}

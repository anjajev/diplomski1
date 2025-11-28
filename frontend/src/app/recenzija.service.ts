import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from './models/review'; // Dodaj model za recenziju

@Injectable({
  providedIn: 'root'
})
export class RecenzijaService {
  private apiUrl = 'http://localhost:4000/recenzije'; // URL ka API-ju za recenzije

  constructor(private http: HttpClient) {}

  dodajRecenziju(kupacId: string, prodavnicaId: string, ocena: number, komentar: string, narudzbinaId: string): Observable<Review> {
    const body = { kupacId, prodavnicaId, ocena, komentar, narudzbinaId };
    return this.http.post<Review>(`${this.apiUrl}/dodajRecenziju`, body);
  }

  dohvatiRecenzije(prodavnicaId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/dohvatiRecenzije/${prodavnicaId}`);
  }

  // NarudzbineService
dohvatiRecenzijeZaNarudzbinu(narudzbinaId: string): Observable<Review[]> {
  return this.http.get<Review[]>(`${this.apiUrl}/narudzbina/${narudzbinaId}/recenzije`);
}

}

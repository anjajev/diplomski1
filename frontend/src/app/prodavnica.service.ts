import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prodavnica } from './models/prodavnica';
import { Artikal } from './models/artikal';

@Injectable({
  providedIn: 'root'
})
export class ProdavnicaService {
  private apiUrl = 'http://localhost:4000/prodavnica';

  constructor(private http: HttpClient) { }

   // Prijava korisnika - vraća samo token, ali ga ne čuva
   login(email: string, password: string) {
    const data = {
      email: email,
      password: password
    };

    // Vraća samo odgovor sa tokenom
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }

  // Registracija korisnika
  register(ime: string, email: string, adresa: string, radnovreme: string, kontakt: string, lozinka: string, tipProfila: string) {
    const data = {
      ime: ime,
      email: email,
      adresa: adresa,
      radnovreme: radnovreme,
      kontakt: kontakt,
      lozinka: lozinka,
      tipProfila: tipProfila
    };
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  dohvatiProdavnicu(email: string): Observable<Prodavnica> {
    // Osiguraj da URL koristi ispravan API endpoint
    return this.http.get<Prodavnica>(`${this.apiUrl}/email/${email}`);
  }
  
  dohvatiProdavnicuSaArtiklima(id: string): Observable<{ prodavnica: Prodavnica }> {
    return this.http.get<{ prodavnica: Prodavnica}>(`${this.apiUrl}/${id}`);
  }
  
  
  azuriraj(email: string, updatedStoreData: Partial<Prodavnica>): Observable<Prodavnica> {
    // Napravi objekat sa podacima koji će se ažurirati
    const data = {
      email: email, // Email prodavnice na osnovu kojeg se ažurira
      ...updatedStoreData // Spajanje svih ažuriranih podataka
    };

    // PUT zahtev ka backendu za ažuriranje prodavnice
    return this.http.put<Prodavnica>(`${this.apiUrl}/azurirajProdavnicu`, data);
  }
  
  dodajArtikal(email: string, artikal: any) {
    return this.http.post(`/api/prodavnice/${email}/artikli`, artikal);
  }
  

    // Provera email adrese
  checkEmail(email: string) {
    const data = { email: email };
    return this.http.post(`${this.apiUrl}/checkemail`, data);
  }

  // Odjava - uklanjamo token iz localStorage
  logout() {
    localStorage.removeItem('token');
  }

  // Proveravamo da li je korisnik prijavljen - na osnovu postojanja tokena
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Vraća true ako postoji token
  }

  uploadProfileImage(email: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('email', email); // Šaljemo email prodavnice
    
    return this.http.post(`${this.apiUrl}/upload-profile-image`, formData);
  }
  
}
